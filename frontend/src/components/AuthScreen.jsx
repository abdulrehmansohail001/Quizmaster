import { useState, useEffect, useRef } from "react";
import api from "../api";
import { styles } from "../styles";
import logo from "../assets/logo.png";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function AuthScreen({ onLoginSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "register" | "verify" | "forgot" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const googleBtnRef = useRef(null);

  const finishLogin = (data) => {
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("token", data.token);

    onLoginSuccess({
      userId: data.userId,
      unlockedLevels: data.unlockedLevels || ["easy"],
      totalXP: data.totalXP || 0,
    });
  };

  useEffect(() => {
    if (mode !== "login" && mode !== "register") return;

    let cancelled = false;

    const tryRender = () => {
      if (cancelled) return;
      if (!window.google || !googleBtnRef.current) {
        setTimeout(tryRender, 100);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: 300,
        shape: "pill",
      });
    };

    tryRender();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const handleGoogleResponse = async (response) => {
    try {
      setError("");
      const res = await api.post("/auth/google", { idToken: response.credential });
      finishLogin(res.data);
    } catch {
      setError("Google sign-in failed");
    }
  };

  const register = async () => {
    try {
      setError("");
      setInfo("");
      await api.post("/auth/register", { email, password });
      setInfo("Code sent! Check your email.");
      setMode("verify");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  const login = async () => {
    try {
      setError("");
      setInfo("");
      const res = await api.post("/auth/login", { email, password });
      finishLogin(res.data);
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.email) {
        setEmail(err.response.data.email);
        setError("");
        setInfo("Please verify your email first — enter the code sent to you, or click Resend.");
        setMode("verify");
      } else {
        setError(err.response?.data?.msg || "Invalid email or password");
      }
    }
  };

  const verifyCode = async () => {
    try {
      setError("");
      const res = await api.post("/auth/verify-code", { email, code });
      finishLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid or expired code");
    }
  };

  const resendCode = async () => {
    try {
      setError("");
      setInfo("");
      await api.post("/auth/register", { email, password });
      setInfo("New code sent! Check your email.");
    } catch (err) {
      setError(err.response?.data?.msg || "Could not resend code");
    }
  };

  const requestPasswordReset = async () => {
    try {
      setError("");
      setInfo("");
      await api.post("/auth/forgot-password", { email });
      setInfo("If that email exists, a reset code has been sent.");
      setMode("reset");
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  const submitNewPassword = async () => {
    try {
      setError("");
      await api.post("/auth/reset-password", { email, code, newPassword });
      setInfo("Password reset! Please log in with your new password.");
      setMode("login");
      setCode("");
      setNewPassword("");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.msg || "Reset failed");
    }
  };

  // ---------------- FORGOT PASSWORD SCREEN ----------------
  if (mode === "forgot") {
    return (
      <div style={styles.appShell}>
        <div style={styles.authGlassCard}>
          <div style={{ ...styles.authBrandLogo, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <img src={logo} alt="QuizMaster" style={{ width: "28px", height: "28px" }} />
            QuizMaster
          </div>
          <h1 style={styles.authTitleLg}>Reset Password</h1>
          <p style={styles.authSubtitleLg}>Enter your email to receive a reset code</p>

          {error && <div style={styles.authErrorBox}>{error}</div>}
          {info && !error && <div style={styles.authInfoBox}>{info}</div>}

          <input
            style={styles.authInput}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="auth-btn-hover"
            style={styles.authPrimaryBtn}
            onClick={requestPasswordReset}
          >
            Send Reset Code
          </button>

          <p
            className="auth-switch-hover"
            style={{ ...styles.authSwitchText, color: "#6b7280" }}
            onClick={() => {
              setMode("login");
              setError("");
              setInfo("");
            }}
          >
            ⬅ Back to login
          </p>
        </div>
      </div>
    );
  }

  // ---------------- RESET PASSWORD SCREEN ----------------
  if (mode === "reset") {
    return (
      <div style={styles.appShell}>
        <div style={styles.authGlassCard}>
          <div style={{ ...styles.authBrandLogo, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <img src={logo} alt="QuizMaster" style={{ width: "28px", height: "28px" }} />
            QuizMaster
          </div>
          <h1 style={styles.authTitleLg}>Enter New Password</h1>
          <p style={styles.authSubtitleLg}>
            Enter the code sent to<br /><b>{email}</b>
          </p>

          {error && <div style={styles.authErrorBox}>{error}</div>}
          {info && !error && <div style={styles.authInfoBox}>{info}</div>}

          <input
            style={styles.authCodeInput}
            placeholder="------"
            value={code}
            maxLength={6}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          />

          <input
            style={styles.authInput}
            placeholder="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            className="auth-btn-hover"
            style={styles.authPrimaryBtn}
            onClick={submitNewPassword}
          >
            Reset Password
          </button>

          <p
            className="auth-switch-hover"
            style={styles.authSwitchText}
            onClick={requestPasswordReset}
          >
            Didn't get a code? Resend
          </p>

          <p
            className="auth-switch-hover"
            style={{ ...styles.authSwitchText, color: "#6b7280" }}
            onClick={() => {
              setMode("login");
              setError("");
              setInfo("");
              setCode("");
              setNewPassword("");
            }}
          >
            ⬅ Back to login
          </p>
        </div>
      </div>
    );
  }

  // ---------------- VERIFY SCREEN (email verification, unchanged) ----------------
  if (mode === "verify") {
    return (
      <div style={styles.appShell}>
        <div style={styles.authGlassCard}>
          <div style={{ ...styles.authBrandLogo, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <img src={logo} alt="QuizMaster" style={{ width: "28px", height: "28px" }} />
            QuizMaster
          </div>
          <h1 style={styles.authTitleLg}>Verify Your Email</h1>
          <p style={styles.authSubtitleLg}>
            Enter the 6-digit code sent to<br /><b>{email}</b>
          </p>

          {error && <div style={styles.authErrorBox}>{error}</div>}
          {info && !error && <div style={styles.authInfoBox}>{info}</div>}

          <input
            style={styles.authCodeInput}
            placeholder="------"
            value={code}
            maxLength={6}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          />

          <button
            className="auth-btn-hover"
            style={styles.authPrimaryBtn}
            onClick={verifyCode}
          >
            Verify & Continue
          </button>

          <p
            className="auth-switch-hover"
            style={styles.authSwitchText}
            onClick={resendCode}
          >
            Didn't get a code? Resend
          </p>

          <p
            className="auth-switch-hover"
            style={{ ...styles.authSwitchText, color: "#6b7280" }}
            onClick={() => {
              setMode("login");
              setError("");
              setInfo("");
              setCode("");
            }}
          >
            ⬅ Back to login
          </p>
        </div>
      </div>
    );
  }

  // ---------------- LOGIN / REGISTER SCREEN ----------------
  const isLogin = mode === "login";

  return (
    <div style={styles.appShell}>
      <div style={styles.authGlassCard}>
        <div style={{ ...styles.authBrandLogo, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <img src={logo} alt="QuizMaster" style={{ width: "28px", height: "28px" }} />
          QuizMaster
        </div>
        <h1 style={styles.authTitleLg}>
          {isLogin ? "Welcome Back 👋" : "Create Account"}
        </h1>
        <p style={styles.authSubtitleLg}>
          {isLogin ? "Login to start quiz" : "Register to begin"}
        </p>

        {error && <div style={styles.authErrorBox}>{error}</div>}
        {info && !error && <div style={styles.authInfoBox}>{info}</div>}

        <div ref={googleBtnRef} style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }} />

        <div style={styles.authDivider}>
          <div style={styles.authDividerLine} />
          <span>or</span>
          <div style={styles.authDividerLine} />
        </div>

        <input
          style={styles.authInput}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.authInput}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isLogin && (
          <p
            className="auth-switch-hover"
            style={styles.authLinkSmall}
            onClick={() => {
              setMode("forgot");
              setError("");
              setInfo("");
            }}
          >
            Forgot password?
          </p>
        )}

        <button
          className="auth-btn-hover"
          style={styles.authPrimaryBtn}
          onClick={isLogin ? login : register}
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          className="auth-switch-hover"
          style={styles.authSwitchText}
          onClick={() => {
            setMode(isLogin ? "register" : "login");
            setError("");
            setInfo("");
          }}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

export default AuthScreen;