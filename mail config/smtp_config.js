// mailer.js
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const emailTemplate = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf-8');

function createTransporter(service) {
  try {
    if (service === 'gmail') {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });

      return {
        transporter: transporter,
        template: emailTemplate,
        from: `"Support Team" <${process.env.GMAIL_USER}>`
      };
    }
  } catch (error) {
    throw error;
  }
}

const sendEmailWithTracker = async (toEmail, userId) => {
  const { transporter, template, from } = createTransporter('gmail');

  const trackingPixelUrl = `http://localhost:3000/track?userId=${userId}`;
  const htmlWithTracker = template.replace('</body>', `<img src="${trackingPixelUrl}" style="display:none;" width="1" height="1" /></body>`);

  const mailOptions = {
    from: from,
    to: toEmail,
    subject: 'Email with Tracking Pixel',
    html: htmlWithTracker
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

module.exports = sendEmailWithTracker;

// Usage example:
// sendEmailWithTracker('receiver@gmail.com', 'user123');
