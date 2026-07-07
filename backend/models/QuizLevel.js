const mongoose = require("mongoose");

const quizLevelSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ["easy", "medium", "hard", "extreme", "impossible"],
    required: true,
  },

  questions: [
    {
      flag: String,
      options: [String],
      answer: String,
    },
  ],
});

module.exports = mongoose.model("QuizLevel", quizLevelSchema);