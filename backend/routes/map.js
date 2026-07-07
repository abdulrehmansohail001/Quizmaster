const express = require('express');
const router = express.Router();
const MapStats = require('../models/MapStats');
const User = require("../models/User");

// 1. Get user's map high score
router.get('/best/:userId', async (req, res) => {
  try {
    const stats = await MapStats.findOne({ userId: req.params.userId });
    res.json(stats || { bestScore: 0, bestXP: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Submit a new attempt
router.post('/submit', async (req, res) => {
  const { userId, score } = req.body; // score is count of countries (e.g., 104)
  const newXP = req.body.xpOverride !== undefined ? req.body.xpOverride : score * 0.25;

  try {
    let stats = await MapStats.findOne({ userId });

    if (!stats) {
      // First time playing the map game
      stats = new MapStats({
        userId,
        bestScore: score,
        bestXP: newXP
      });
      await stats.save();
      await User.findByIdAndUpdate(userId, { $inc: { totalXP: newXP } });
    } else {
      // Logic: Only update if the new XP is higher than the best XP
      if (newXP > stats.bestXP) {
        const diff = newXP - stats.bestXP;
        stats.bestScore = score;
        stats.bestXP = newXP;
        stats.lastAttemptDate = Date.now();
        await stats.save();
        await User.findByIdAndUpdate(userId, { $inc: { totalXP: diff } });
      }
    }

    res.json({ success: true, currentBestXP: stats.bestXP });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;