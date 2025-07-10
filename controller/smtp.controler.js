const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const BASE_URL = `https://chcek-xwqu.onrender.com`  ;

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


exports.trackOpen = async (req, res) => {
  const { token } = req.params;

  

  try {
    console.log(`✅ Tracking hit for token: ${token} at ${new Date()}`);
    console.log(`User-Agent: ${req.get('User-Agent') || 'Unknown'}`);
    console.log(`Client IP: ${req.ip || 'Unknown'}`);

    const tracker = memoryStore.trackers.find(t => t.token === token);
    if (tracker && !tracker.opened) {
      tracker.opened = true;
      tracker.openedAt = new Date();
    }

    res.set('Content-Type', 'image/gif');
    res.send(Buffer.from('R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', 'base64'));
  } catch (err) {
    console.error(`❌ Failed to track token ${token}: ${err.message}`);
    res.set('Content-Type', 'image/gif');
    res.send(Buffer.from('R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', 'base64'));
  }
};

exports.getAllTrackers = async (req, res) => {
  try {
    res.json({ success: true, data: memoryStore.trackers });
    
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
};
