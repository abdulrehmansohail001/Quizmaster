const express = require("express");
const router = express.Router();
const Score = require("../models/Score");
const User = require("../models/User");

// ⭐ XP Configuration
const xpRewards = {
  easy: { base: 5, bonus: 1 },
  medium: { base: 6, bonus: 2 },
  hard: { base: 7, bonus: 3 },
  extreme: { base: 8, bonus: 4 },
  impossible: { base: 10, bonus: 4 } // Total max: 50
};

// SAVE SCORE + UPDATE PROGRESS
router.post("/", async (req, res) => {
  try {
    const { userId, level, score, total } = req.body;

    // 1. Save score to Score collection (Your existing logic)
    await Score.create({ userId, level, score, total });

    // 2. Update user progress
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Add to history array
    user.completedLevels.push({ level, score, total });

    // ⭐ NEW: XP Logic (Anti-Abuse)
    // Only award XP if score >= 8 and they haven't conquered this level before
    if (score >= 8 && !user.conqueredLevels[level]) {
      let earned = xpRewards[level].base;
      if (score === 10) earned += xpRewards[level].bonus;

      user.totalXP += earned;
      user.conqueredLevels[level] = true; // Mark as done forever
    }

    // 3. Unlock logic (Your existing logic)
    const order = ["easy", "medium", "hard", "extreme", "impossible"];
    if (score >= 8) {
      const idx = order.indexOf(level);
      const next = order[idx + 1];
      if (next && !user.unlockedLevels.includes(next)) {
        user.unlockedLevels.push(next);
      }
    }

    await user.save();

    res.json({
      success: true,
      totalXP: user.totalXP, // Return new XP to frontend
      unlockedLevels: user.unlockedLevels,
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;