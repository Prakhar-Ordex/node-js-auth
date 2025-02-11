const express = require('express');
const { genrateCertificate, findCertificatesByID } = require('../controllers/certificate.controller');

const Router = express.Router();

Router.post('/certificates',genrateCertificate) 
Router.get('/certificates/:id',findCertificatesByID) 

module.exports = Router;