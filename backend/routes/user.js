const express = require("express");
const router = express.Router();
const User = require("../models/User");
const QuizLevel = require("../models/QuizLevel");
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const unlockedLevels = Array.isArray(user.unlockedLevels)
      ? [...user.unlockedLevels]
      : ["easy"];

    if (!unlockedLevels.includes("easy")) {
      unlockedLevels.unshift("easy");
    }

    res.json({
      unlockedLevels,
      completedLevels: Array.isArray(user.completedLevels)
        ? user.completedLevels
        : [],
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
router.post("/complete", async (req, res) => {
  try {
    const { userId, level, score, total } = req.body;

    const user = await User.findById(userId);

    if (!user.completedLevels) user.completedLevels = [];
    if (!Array.isArray(user.unlockedLevels)) user.unlockedLevels = ["easy"];
    if (!user.unlockedLevels.includes("easy")) {
      user.unlockedLevels.unshift("easy");
    }

    // 1. save history
    user.completedLevels.push({
      level,
      score,
      total,
    });

    // 2. unlock next level
    const order = [
      "easy",
      "medium",
      "hard",
      "extreme",
      "impossible",
    ];

    if (score >= 8) {
      const index = order.indexOf(level);
      const nextLevel = order[index + 1];

      if (
        nextLevel &&
        !user.unlockedLevels.includes(nextLevel)
      ) {
        user.unlockedLevels.push(nextLevel);
      }
    }

    await user.save();

    res.json({
      message: "Updated",
      unlockedLevels: user.unlockedLevels,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;