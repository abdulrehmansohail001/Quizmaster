const express = require("express");
const router = express.Router();
const DailyFind = require("../models/DailyFind");
const User = require("../models/User");
// 1. Get user's current Daily Find stats
router.get("/stats/:userId", async (req, res) => {
  try {
    const stats = await DailyFind.findOne({ userId: req.params.userId });
    res.json(stats || { totalAccumulatedXP: 0, lastCompletedDate: "" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Claim the +5 XP for completing today's challenge
router.post("/claim", async (req, res) => {
  const { userId } = req.body;
  const today = new Date().toISOString().slice(0, 10);

  try {
    let stats = await DailyFind.findOne({ userId });

    if (!stats) {
      stats = new DailyFind({
        userId,
        totalAccumulatedXP: 5,
        lastCompletedDate: today,
        streak: 1
      });
    } else {
      // Prevent double claiming
      if (stats.lastCompletedDate === today) {
        return res.status(400).json({ message: "Already claimed today's XP!" });
      }

      stats.totalAccumulatedXP += 5;
      // When the user claims their +5 XP
      stats.lastCompletedDate = today;
      stats.streak += 1;
    }
    await stats.save();
    
await User.findByIdAndUpdate(userId, { $inc: { totalXP: 5 } });
    res.json({ success: true, totalXP: stats.totalAccumulatedXP });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;