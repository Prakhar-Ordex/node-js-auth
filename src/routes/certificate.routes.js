const express = require('express');
const { genrateCertificate, findCertificatesByID } = require('../controllers/certificate.controller');
const validateCertificateAccess = require('../middleware/certificate.middleware');

const Router = express.Router();

Router.post('/certificates',genrateCertificate) 
Router.get('/certificates/:id',validateCertificateAccess,findCertificatesByID) 

module.exports = Router;