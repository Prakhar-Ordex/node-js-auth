const Result = require("../models/answer.model");
const Certificate = require("../models/certificate.model");
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
  // console.log("req>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",req.body,req.id)
  try {
    const { quizName, answers } = req.body;
    const id = req.id;
    const refreshToken = req.cookies?.refresh_token;
    console.log("refresh>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", refreshToken)

    const questions = await Question.findAll({ attributes: ['id', 'correctAnswer'] });
    // console.log("first>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",questions)
    let score = 0;

    questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        score++;
      }
    });

    const passingScore = Math.ceil(questions.length * 0.85);
    const passed = score >= passingScore;

    const result = new Result({
      userId: id,
      score: score,
      passingStatus: passed,
      quizName: quizName,
      totalQuestions: questions.length
    });

    await result.save();

    console.log("result>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", id);

    const resultData = result.dataValues;

    if (resultData.passingStatus) {
      try {
        const certificate = await Certificate.create({
          userId: resultData.userId,
          quizId: resultData.id,
          score: resultData.score,
        });

        const certificateData = certificate.dataValues;

        return res.status(200).json({
          passingStatus: resultData.passingStatus,
          score: resultData.score,
          certificateID: certificateData.id,
          totalQuestions: resultData.totalQuestions
        });
        // console.log("certificate>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", certificate.dataValues);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      return res.status(200).json(
        {
          passingStatus: resultData.passingStatus,
          score: resultData.score, 
          totalQuestions: resultData.totalQuestions,
          passingScore:passingScore
        });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  questions,
  submitQuestions
}