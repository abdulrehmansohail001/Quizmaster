require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const QuizLevel = require('./models/QuizLevel');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne().lean();
    const levels = await QuizLevel.find({}, { level: 1 }).lean();
    console.log('user:', user);
    console.log('levels:', levels.map(l => l.level));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
})();
