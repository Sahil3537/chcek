const transporter = require('../mail config/smtp_config');
require('dotenv').config();
const fs = require('fs');

exports.sendEmail = async (req, res) => {
    const { to, subject, service,  } = req.body;
    const username = req.body.userName || 'Guest';
const body = req.body.body || 'Hello! This is your welcome message.';

    const config = transporter(service);

    if (!config) {
        return res.status(400).json({ success: false, message: 'Invalid service' });
    }

    // Load template
    let htmlbody = config.template
    .replace(/{{username}}/g, username || 'Guest')
    .replace(/{{body}}/g, body || 'This is a default welcome message.');;

    // Replace dynamic placeholders
   
    const mailOptions = {
        from: config.from,
        to,
        subject,
        text: body,
        html: htmlbody
    };

    try {
        const info = await config.transporter.sendMail(mailOptions);
        res.json({ message: 'Mail sent successfully', statusbar: 200, success: true, data: info });
    } catch (error) {
        console.log('error>>>> ', error.message);
        res.json({ message: "Error while sending mail", success: false, statusbar: 500 });
    }
};
