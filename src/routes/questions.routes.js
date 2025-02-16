const express = require('express');
const { questions, submitQuestions, getAllquiz, addQuestions } = require('../controllers/questions.controller');
const authenticate = require('../middleware/login.middleware');


const Router = express.Router();

Router.get('/questions',authenticate, questions)
Router.get('/allquiz', getAllquiz)
Router.post('/submit', authenticate,submitQuestions)
Router.post('/add-questions', addQuestions)

module.exports = Router;