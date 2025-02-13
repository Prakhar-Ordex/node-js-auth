const Result = require("../models/result.model");
const Certificate = require("../models/certificate.model");
const Question = require("../models/question.model");

const questions = async (req, res) => {
  try {
    const { type, title } = req.query;
    console.log("type and title > ", type, title);

    if (type && title) {
      const questions = await Question.findAll({
        attributes: ['id', 'question', 'options'],
        where: { type, title },
      });
      res.status(200).json(questions);
    } else {
      const questions = await Question.findAll({
        attributes: ['id', 'question', 'options'],
      });
      res.status(200).json(questions);
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getAllquiz = async (req, res) => {
  try {
    const quiz = await Question.findAll({
      attributes: ['type', 'title'],
      group: ['type', 'title'], // Group by both type and title to get unique combinations
    });
    return res.status(201).json(quiz);
  } catch (error) {
    console.log(error)
  }
}

const submitQuestions = async (req, res) => {
  // console.log("req>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",req.body,req.id)
  try {
    const { title, answers,type } = req.body;
    const id = req.id;
    const refreshToken = req.cookies?.refresh_token;
    console.log("refresh>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", refreshToken)

    const questions = await Question.findAll({ attributes: ['id', 'correctAnswer'], where: { type, title }, });
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
      quizName: title,
      totalQuestions: questions.length
    });

    await result.save();

    console.log("result>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", id);

    const resultData = result.dataValues;

    if (resultData.passingStatus) {
      try {
        // Check if user already has a passing certificate for this quiz
        const existingCertificate = await Certificate.findOne({
          where: {
            userId: resultData.userId,
            quizName: title,
          }
        });

        let certificateData;
        
        if (existingCertificate) {
          // Update existing certificate with new score
          existingCertificate.score = resultData.score;
          await existingCertificate.save();
          certificateData = existingCertificate.dataValues;
        } else {
          // Create new certificate only if one doesn't exist
          const certificate = await Certificate.create({
            userId: resultData.userId,
            quizId: resultData.id,
            score: resultData.score,
            quizName: title,
          });
          certificateData = certificate.dataValues;
        }

        return res.status(200).json({
          passingStatus: resultData.passingStatus,
          score: resultData.score,
          certificateID: certificateData.id,
          totalQuestions: resultData.totalQuestions
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      return res.status(200).json(
        {
          passingStatus: resultData.passingStatus,
          score: resultData.score,
          totalQuestions: resultData.totalQuestions,
          passingScore: passingScore
        });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  questions,
  submitQuestions,
  getAllquiz
}