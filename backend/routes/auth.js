const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
}

function buildAuthResponse(user, token) {
  let unlockedLevels =
    Array.isArray(user.unlockedLevels) && user.unlockedLevels.length > 0
      ? [...user.unlockedLevels]
      : ["easy"];
  if (!unlockedLevels.includes("easy")) unlockedLevels.unshift("easy");

  return {
    token,
    userId: user._id,
    email: user.email,
    unlockedLevels,
    totalXP: user.totalXP || 0,
  };
}

// REGISTER — creates unverified user, sends OTP code
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user && user.emailVerified) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    if (user) {
      user.password = hashedPassword;
      user.otpCode = otpCode;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      user = await User.create({
        email,
        password: hashedPassword,
        otpCode,
        otpExpiry,
        emailVerified: false,
      });
    }

    // Respond immediately — email sends in the background
    res.json({ msg: "Verification code sent", email });

    resend.emails
      .send({
        from: "QuizMaster <onboarding@resend.dev>",
        to: email,
        subject: "Your QuizMaster verification code",
        text: `Your verification code is ${otpCode}. It expires in 10 minutes.`,
      })
      .then((result) => {
        console.log("Email sent:", result.data?.id);
      })
      .catch((err) => {
        console.error("Email send failed:", err.message);
      });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// VERIFY CODE — confirms OTP, marks verified, logs user in
router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found" });
    if (!user.otpCode || !user.otpExpiry) {
      return res.status(400).json({ msg: "No pending code for this email" });
    }
    if (user.otpCode !== code) {
      return res.status(400).json({ msg: "Incorrect code" });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ msg: "Code expired, please register again" });
    }

    user.emailVerified = true;
    user.otpCode = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    res.json(buildAuthResponse(user, token));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found" });

    if (!user.password) {
      return res.status(400).json({ msg: "This account uses Google sign-in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

    if (!user.emailVerified) {
      return res.status(403).json({ msg: "Please verify your email first", email: user.email });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    res.json(buildAuthResponse(user, token));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GOOGLE SIGN-IN
router.post("/google", async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email } = payload;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await User.create({
        email,
        googleId,
        emailVerified: true,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.emailVerified = true;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    res.json(buildAuthResponse(user, token));
  } catch (err) {
    res.status(400).json({ error: "Google sign-in failed" });
  }
});

// FORGOT PASSWORD — sends a reset code
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ msg: "If that email exists, a reset code has been sent" });
    }

    if (!user.password) {
      return res.status(400).json({ msg: "This account uses Google sign-in, no password to reset" });
    }

    const resetCode = generateOTP();
    const resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetCode = resetCode;
    user.resetCodeExpiry = resetCodeExpiry;
    await user.save();

    res.json({ msg: "If that email exists, a reset code has been sent" });

    resend.emails
      .send({
        from: "QuizMaster <onboarding@resend.dev>",
        to: email,
        subject: "Your QuizMaster password reset code",
        text: `Your password reset code is ${resetCode}. It expires in 10 minutes.`,
      })
      .then((result) => {
        console.log("Reset email sent:", result.data?.id);
      })
      .catch((err) => {
        console.error("Reset email send failed:", err.message);
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RESET PASSWORD — verifies code, sets new password
router.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "Invalid request" });
    if (!user.resetCode || !user.resetCodeExpiry) {
      return res.status(400).json({ msg: "No pending reset for this email" });
    }
    if (user.resetCode !== code) {
      return res.status(400).json({ msg: "Incorrect code" });
    }
    if (user.resetCodeExpiry < new Date()) {
      return res.status(400).json({ msg: "Code expired, please request a new one" });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = null;
    user.resetCodeExpiry = null;
    await user.save();

    res.json({ msg: "Password reset successful. Please log in." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;