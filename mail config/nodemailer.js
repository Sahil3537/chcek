// mail config/nodemailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

exports.transporter = async (service) => {
  const email = process.env.GMAIL_USER;
  const pass  = process.env.GMAIL_PASS;

  if (service !== 'gmail') {
    throw new Error('Unsupported mail service');
  }

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: email, pass: pass }
  });

  return {
    transport,
    from: `"Support Team" <${email}>`
  };
};
