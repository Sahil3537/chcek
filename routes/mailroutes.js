const express = require('express')
const routes = express.Router()
const{sendEmail}= require('../controller/smtp.controler')
const {receiveEmail}= require('../controller/imap.controller')
const  emailController = require("../controller/Mail.tracker.controller")


routes.get('/track/:token', emailController.trackOpen);
routes.post('/send', sendEmail)
routes.get('/receiveEmail', receiveEmail)

routes.get('/track', emailController.getAllTrackers);
module.exports = routes