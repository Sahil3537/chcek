const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// In-memory store to replace DB
const memoryStore = {
  trackers: [],
};

exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    if (!to) return res.status(400).json({ success: false, message: "Missing 'to' field" });

    const token = uuidv4();

    // Save to in-memory array
    memoryStore.trackers.push({ to, token, opened: false, openedAt: null });

    const cacheBuster = Date.now();
    const pixel = `<img src="${BASE_URL}/api/track/${token}?cb=${cacheBuster}" width="1" height="1" style="display:none;visibility:hidden;opacity:0;border:0;" alt="" />`;

    const defaultHtml = '<h2>Hello 👋</h2><p>This email has a tracking pixel.</p>';
    const finalHtml = `<div>${pixel}${html || defaultHtml}</div>`;

    console.log('Tracking pixel URL:', `${BASE_URL}/api/track/${token}?cb=${cacheBuster}`);
    console.log('HTML content being sent:\n', finalHtml);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      headers: {
        'X-Mailer': 'Custom-Tracker',
      },
    });

    const mailOptions = {
      from: `"Tracker" <${process.env.GMAIL_USER}>`,
      to,
      subject: subject || 'Tracked Email',
      html: finalHtml,
      authenticationResults: {
        spf: 'pass',
        dkim: 'pass',
      },
    };

    const info = await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent', token, info });
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
};
