const express = require('express')
const routes = express.Router()
const{sendEmail}= require('../controller/smtp controler')
const {receiveEmail}= require('../controller/imap.controller')

routes.post('/send', sendEmail)
routes.get('/receiveEmail', receiveEmail)


module.exports = routes