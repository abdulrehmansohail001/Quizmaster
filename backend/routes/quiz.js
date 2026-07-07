const express = require("express");
const router = express.Router();
const QuizLevel = require("../models/QuizLevel");
const User = require("../models/User");

// GET QUIZ BY LEVEL (WITH USER CHECK)
router.get("/:level/:userId", async (req, res) => {
  try {
    const { level, userId } = req.params;

    // 1. get user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2. check if level is unlocked
    const unlockedLevels = Array.isArray(user.unlockedLevels)
      ? [...user.unlockedLevels]
      : ["easy"];

    if (!unlockedLevels.includes("easy")) {
      unlockedLevels.unshift("easy");
    }

    if (!unlockedLevels.includes(level)) {
      return res.status(403).json({
        error: "Level locked",
      });
    }

    // 3. get quiz
    const quiz = await QuizLevel.findOne({ level });

    if (!quiz) {
      return res.status(404).json({ error: "Level not found" });
    }

    res.json(quiz.questions);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;