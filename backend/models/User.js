const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,

  // Google OAuth
  googleId: { type: String, default: null },

  // Email verification
  emailVerified: { type: Boolean, default: false },
  otpCode: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
  resetCode: { type: String, default: null },
  resetCodeExpiry: { type: Date, default: null },

  // ⭐ XP Tracking fields
  totalXP: { type: Number, default: 0 },
  conqueredLevels: {
    easy: { type: Boolean, default: false },
    medium: { type: Boolean, default: false },
    hard: { type: Boolean, default: false },
    extreme: { type: Boolean, default: false },
    impossible: { type: Boolean, default: false }
  },

  unlockedLevels: {
    type: [String],
    default: ["easy"],
    set: (v) => {
      if (!Array.isArray(v) || v.length === 0) return ["easy"];
      if (!v.includes("easy")) v.unshift("easy");
      return v;
    },
  },

  completedLevels: [
    {
      level: String,
      score: Number,
      total: Number,
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);