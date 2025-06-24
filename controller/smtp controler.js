const transporter = require('../mail config/smtp_config')
require('dotenv').config()
const path = require('path')
exports.sendEmail = async (req, res) => {
    const { to, subject, body, service } = req.body


    const config = transporter(service)
    
    const image = ` <div style="max-width:600px;margin:auto;">
      <img 
        src="https://res.cloudinary.com/ddeonryiq/image/upload/v1750752612/pexels-rdne-7563675_lgzbb9.jpg"
        alt="Banner"
        style="width:100%;display:block;" />
      <h2 style="background:#4285f4;color:white;padding:10px;text-align:center;">Welcome!</h2>
      <p style="padding:20px;">Click below to start:</p>
    </div>  ` ;

const htmlbody = config.temlate.replace(`{{image}}`, image )

    //validation 

    if (!config) {
        return res.status(400).json({ success: false, message: 'Invalid service' });
    }


    const mailOptions = {
        from: config.from,
        to,
        subject,
        text: body,
        html: htmlbody



    }

    try {
        const info = await config.transporter.sendMail(mailOptions)
        res.json({ message: 'mail sent successfully', statusbar: 200, success: true, data: info })

    } catch (error) {
        console.log('error>>>> ', error.message);
        res.json({ message: "error while sending mail", success: false, statusbar: 500 })

    }
}
