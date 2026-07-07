const mongoose = require('mongoose');

const MapStatsSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  bestScore: { 
    type: Number, 
    default: 0 // Max countries guessed out of 197
  },
  bestXP: { 
    type: Number, 
    default: 0 // (bestScore * 0.25)
  },
  lastAttemptDate: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('MapStats', MapStatsSchema);