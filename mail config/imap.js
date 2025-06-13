const Imap = require('imap');
require('dotenv').config();


const imap = new Imap({
  user: process.env.GMAIL_USER,
  password: process.env.GMAIL_PASS,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  authTimeout: 10000,
  tlsOptions: {
    rejectUnauthorized: false // ✅ this skips the self-signed certificate error
  }
});


 module.exports= imap;
