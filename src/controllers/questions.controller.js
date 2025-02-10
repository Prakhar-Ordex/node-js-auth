const Result = require("../models/answer.model");
const Question = require("../models/question.model");

const questions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      attributes: ['id', 'question', 'options'] // Exclude correct answers
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const submitQuestions = async (req, res) => {
  try {
    const { userId, answers } = req.body;
    const questions = await Question.findAll({ attributes: ['id', 'correctAnswer'] });

    let score = 0;

    questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        score++;
      }
    });

    const passingScore = Math.ceil(questions.length * 0.85);
    const passed = score >= passingScore;

    const result = new Result({
      userId,
      score,
      passed
    });

    await result.save();
    res.json({ passed, score });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  questions,
  submitQuestions
}