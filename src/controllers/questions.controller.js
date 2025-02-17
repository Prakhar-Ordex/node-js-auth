const Result = require("../models/result.model");
const Certificate = require("../models/certificate.model");
const Question = require("../models/question.model");

const questions = async (req, res) => {
  try {
    const { type, title } = req.query;
    console.log("type and title > ", type, title);

    let questions;
    if (type && title) {
      questions = await Question.findAll({
        attributes: ['id', 'question', 'options'],
        where: { type, title },
      });

      // Shuffle the questions array using Fisher-Yates algorithm
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }

      // Optionally limit the number of questions if you want to select only a subset
      // questions = questions.slice(0, desiredNumberOfQuestions);
    } else {
      questions = await Question.findAll({
        attributes: ['id', 'question', 'options'],
      });
    }

    // Calculate total time based on the number of questions
    const totalTime = questions.length * 60; // 1 minute per question

    res.status(200).json({ questions, totalTime }); // Include total time in the response

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

    const questions = await Question.findAll({ attributes: ['id', 'question','options', 'correctAnswer'], where: { type, title }, });
    // console.log("first>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",questions)
    let score = 0;
    const questionResults = {};

    questions.forEach((question) => {
      const isCorrect = answers[question.id] === question.correctAnswer;
      if (isCorrect) {
        score++;
      }
      questionResults[question.id] = {
        isCorrect,
        userAnswer: answers[question.id],
        correctAnswer: question.correctAnswer
      };
    });

    const passingScore = Math.ceil(questions.length * 0.85);
    const passed = score >= passingScore;

    const result = new Result({
      userId: id,
      score: score,
      passingStatus: passed,
      quizName: title,
      totalQuestions: questions.length,
      answers: answers 
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
          totalQuestions: resultData.totalQuestions,
          answers,
          questions,
          questionResults
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
          passingScore: passingScore,
          answers,
          questions,
          questionResults
        });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const addQuestions = async (req, res) => {
  try {
    const questionsData = req.body; // Array of questions
    
    // Validate input data
    if (!Array.isArray(questionsData)) {
      return res.status(400).json({ message: "Questions data must be an array" });
    }

    // Check if each question has required fields
    for (const question of questionsData) {
      if (!question.type || !question.title || !question.question || 
          !Array.isArray(question.options) || question.correctAnswer === undefined) {
        return res.status(400).json({ 
          message: "Each question must have type, title, question, options array, and correctAnswer" 
        });
      }
    }

    // Add questions to database
    const createdQuestions = await Question.bulkCreate(questionsData);

    res.status(201).json({
      message: `Successfully added ${createdQuestions.length} questions`,
      questions: createdQuestions
    });

  } catch (error) {
    console.error('Error adding questions:', error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  questions,
  submitQuestions,
  getAllquiz,
  addQuestions
}