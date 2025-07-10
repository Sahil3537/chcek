const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const trackerModel = require('../model/tracker.model');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    if (!to) return res.status(400).json({ success: false, message: "Missing 'to' field" });

    // ✅ Generate token and save in DB
    const token = uuidv4();
    await trackerModel.saveTracking(to, token);

    // ✅ Add token visibly in email for testing
  pixel = '<img src="https://6f70b602526b.ngrok-free.app/api/track/' + token + '" width="10" height="10" style="opacity:0.01;" alt="tracker pixel" />';

   console.log('Tracking pixel URL:', `${BASE_URL}/api/track/${token}`);



    // ✅ Add your content + the pixel for testing
    const finalHtml = (html || '<h2>Hello 👋</h2><p>This email has a tracking pixel.</p>') + pixel;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Tracker" <${process.env.GMAIL_USER}>`,
      to,
      subject: subject || 'Tracked Email',
      html: finalHtml,
    };
    console.log('HTML content being sent:\n', finalHtml);


    const info = await transporter.sendMail(mailOptions);

    // ✅ Respond back with token in API too
    res.json({ success: true, message: 'Email sent', token, info });
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
};
