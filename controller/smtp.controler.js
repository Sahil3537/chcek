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

    // ✅ Create tracking pixel with cache-busting parameter
    const cacheBuster = Date.now(); // Add timestamp to avoid caching
    const pixel = `<img src="${BASE_URL}/api/track/${token}?cb=${cacheBuster}" width="1" height="1" style="display:none;visibility:hidden;opacity:0;border:0;" alt="" />`;

    // ✅ Minify HTML and place pixel near the top to avoid Gmail clipping
    const defaultHtml = '<h2>Hello 👋</h2><p>This email has a tracking pixel.</p>';
    const finalHtml = `<div>${pixel}${html || defaultHtml}</div>`;

    // ✅ Log the HTML for debugging
    console.log('Tracking pixel URL:', `${BASE_URL}/api/track/${token}?cb=${cacheBuster}`);
    console.log('HTML content being sent:\n', finalHtml);

    // ✅ Configure Nodemailer with Gmail and proper sender authentication
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // Consider using OAuth2 for better security
      },
      // Add custom headers for better deliverability
      headers: {
        'X-Mailer': 'Custom-Tracker',
      },
    });

    const mailOptions = {
      from: `"Tracker" <${process.env.GMAIL_USER}>`,
      to,
      subject: subject || 'Tracked Email',
      html: finalHtml,
      // Add authentication headers for deliverability
      authenticationResults: {
        spf: 'pass',
        dkim: 'pass',
      },
    };

    // ✅ Send email
    const info = await transporter.sendMail(mailOptions);

    // ✅ Respond with token and email info
    res.json({ success: true, message: 'Email sent', token, info });
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
};