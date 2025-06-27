const transporter = require('../mail config/smtp_config');
require('dotenv').config();

exports.sendEmail = async (req, res) => {
  const { to, subject, html } = req.body;
  const service = req.body.service || 'gmail';

  const config = transporter(service);

  if (!config) {
    return res.status(400).json({ success: false, message: 'Invalid service' });
  }

  const mailOptions = {
    from: config.from,
    to,
    subject,
    html,                   // ✅ Use full HTML directly
    text: 'Please view this email in an HTML-compatible client.' // fallback plain text
  };

  try {
    const info = await config.transporter.sendMail(mailOptions);
    res.json({ message: 'Mail sent successfully', success: true, data: info });
  } catch (error) {
    console.error('Send mail error:', error.message);
    res.status(500).json({ message: 'Failed to send email', success: false });
  }
};
