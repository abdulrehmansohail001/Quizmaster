const mongoose = require("mongoose");

const DailyFindSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    unique: true 
  },
  totalAccumulatedXP: { 
    type: Number, 
    default: 0 
  },
  lastCompletedDate: { 
    type: String // Format: "2026-05-05"
  },
  streak: { 
    type: Number, 
    default: 0 
  }
});

module.exports = mongoose.model("DailyFind", DailyFindSchema);