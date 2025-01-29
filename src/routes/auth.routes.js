const express = require('express');
const { singUp, singIn, logOut,cheakMail, getProfile } = require('../controllers/auth.controller');


const Router = express.Router();

Router.post('/signIn',singIn)
Router.post('/signUp',singUp)
Router.post('/logOut',logOut)
Router.get('/profile',getProfile)

// Router.post('/cheakmail',cheakMail)

module.exports = Router