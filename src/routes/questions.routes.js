const express = require('express');
const { questions, submitQuestions, getAllquiz } = require('../controllers/questions.controller');
const authenticate = require('../middleware/login.middleware');


const Router = express.Router();

Router.get('/questions', questions)
Router.get('/allquiz', getAllquiz)
Router.post('/submit', authenticate,submitQuestions)

module.exports = Router;