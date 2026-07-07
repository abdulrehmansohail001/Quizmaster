const mongoose = require("mongoose");

const FlagRevealStatsSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    unique: true 
  },
  totalXP: { 
    type: Number, 
    default: 0 
  },
  lastPlayed: { 
    type: String // Format: "2026-05-05" to prevent double-claiming
  },
  streak: { 
    type: Number, 
    default: 0 
  }
});

module.exports = mongoose.model("FlagRevealStats", FlagRevealStatsSchema);