const express = require('express')
const path = require('path');


const routes = express.Router()
const{sendEmail}= require('../controller/smtp.controler')
const {receiveEmail}= require('../controller/imap.controller')
const  emailController = require("../controller/smtp.controler")


routes.get('/track/:token', emailController.trackOpen);
routes.post('/send', sendEmail)
routes.get('/receiveEmail', receiveEmail)

routes.get('/track', emailController.getAllTrackers);


routes.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

routes.get('/ping', (req, res) => {
  res.json({ status: 'ok', message: 'Server is alive 🚀' });
});
module.exports = routes