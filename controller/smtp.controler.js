const {transporter:nodemailer} = require('../mail config/nodemailer')
const pixels = require('../utils/pixel.utils')
require('dotenv').config();


exports.sendEmail = async (req, res) => {
    try {
        const { to, subject, body, html, service } = req.body;

        const config = await nodemailer(service);
        if (!config) {
            return res.status(400).json({ success: false, message: "Invalid mail service" });
        }


        // Generate tracking pixel + inject
        const trackPixel = await pixels.generateToken(to)
        let  finalHtml = html
        if (finalHtml) {
            finalHtml+=trackPixel;
        }
   


        const mailOptions = {
            from: config.from,
            to,
            subject,
            text: body || 'This is a default message.',
            ...(finalHtml && { html: finalHtml })
        };

        // Only add HTML if provided


            const info = await config.transport.sendMail(mailOptions);

        res.json({
            message: 'Mail sent successfully',
            success: true,
            data: info
        });

    } catch (error) {
        console.error('Send mail error:', error.message);
        res.status(500).json({ message: 'Failed to send email', success: false });
    }
};
