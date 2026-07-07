const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    // Find users who have at least 1 XP, sort by highest XP
    const data = await User.find({ totalXP: { $gt: 0 } }, "email totalXP")
      .sort({ totalXP: -1 })
      .limit(10); // Top 10

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;