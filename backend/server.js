require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();

// DB connect
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// routes
const userRoutes = require("./routes/user");
app.use("/user", userRoutes);
app.use("/leaderboard", require("./routes/leaderboard"));
app.use("/auth", require("./routes/auth"));
app.use("/quiz", require("./routes/quiz"));
app.use("/map", require("./routes/map"));
app.use("/score", require("./routes/score"));
// server.js
app.use("/dailyfind", require("./routes/dailyFind")); // lowercase in URL
const flagRevealRoutes = require("./routes/flagReveal");
app.use("/flag-reveal", flagRevealRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});