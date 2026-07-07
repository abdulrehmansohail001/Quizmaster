const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    userId: String,
    level: String,   // ⭐ ADD THIS
    score: Number,
    total: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Score", scoreSchema);