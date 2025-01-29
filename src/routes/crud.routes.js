const express = require('express');
const { createUser, getAllUsers, updateUser, deleteUser, bulkCreate, findUserbyId } = require('../controllers/crude.controller');
const authenticate = require('../middleware/login.middleware');

const Router = express.Router();

Router.post('/create',authenticate, createUser)
Router.post('/create/bulk',authenticate, bulkCreate)
Router.get('/read',authenticate,getAllUsers)
Router.patch('/update/:id',authenticate,updateUser)
Router.delete('/delete/:id',authenticate,deleteUser)
Router.get('/users/:id',authenticate,findUserbyId)

module.exports = Router