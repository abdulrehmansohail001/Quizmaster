const express = require("express");
const router = express.Router();
const FlagRevealStats = require("../models/FlagRevealStats");
const User = require("../models/User");
// 1. Get the target for today (ISO Codes for react-world-flags)
// You can expand this list as you like
const ISO_POOL = [
  // Your Original 10
  "PK", "BR", "FR", "CA", "JP", "DE", "AR", "US", "TR", "ID",
  // 40 Additional Countries
  "GB", "CN", "IN", "RU", "IT", "ES", "MX", "AU", "KR", "SA",
  "ZA", "NG", "EG", "TH", "VN", "PH", "MY", "SG", "NL", "BE",
  "CH", "SE", "NO", "DK", "FI", "PL", "PT", "GR", "IE", "AT",
  "NZ", "CO", "CL", "PE", "UA", "RO", "HU", "CZ", "IL", "AE"
];


router.get("/daily-target", (req, res) => {
  const today = new Date().toISOString().slice(0, 10); // "2026-05-05"
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash * 31 + today.charCodeAt(i)) % ISO_POOL.length;
  }
  res.json({ countryCode: ISO_POOL[hash] });
});
// Add this after the /daily-target route
router.get("/stats/:userId", async (req, res) => {
  try {
    const stats = await FlagRevealStats.findOne({ userId: req.params.userId });
    res.json(stats || { totalXP: 0, lastPlayed: "" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 2. Claim XP after winning
router.post("/claim", async (req, res) => {
  const { userId, points } = req.body; // Points sent from React (15, 10, 5, or 2)
  const today = new Date().toISOString().slice(0, 10);

  try {
    let stats = await FlagRevealStats.findOne({ userId });

    if (!stats) {
      stats = new FlagRevealStats({
        userId,
        totalXP: points,
        lastPlayed: today,
        streak: 1
      });
    } else {
      // Prevent multiple claims in one day
      if (stats.lastPlayed === today) {
        return res.status(400).json({ message: "Already completed today's flag!" });
      }

      stats.totalXP += points;
      stats.lastPlayed = today;
      stats.streak += 1;
    }

    await stats.save();
    await User.findByIdAndUpdate(userId, { $inc: { totalXP: points } });
    res.json({ success: true, newTotal: stats.totalXP });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;