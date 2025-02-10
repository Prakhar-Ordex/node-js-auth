const express = require('express');
const { questions, submitQuestions } = require('../controllers/questions.controller');


const Router = express.Router();

Router.get('/questions', questions)
Router.post('/submit', submitQuestions)

module.exports = Router;