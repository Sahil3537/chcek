const transporter = require('../mail config/smtp_config')
require('dotenv').config() 
exports.sendEmail = async(req, res)=>{
    const {to, subject, text}= req.body

    const mailOptions = {
       from: '"Support Team" <no-reply@yourdomain.com>',
        to, 
        subject,
         text
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        res.json({message:'mail sent successfully', statusbar:200, success:true})
        
    } catch (error) {
        console.log('error>>>> ', error.message);
        res.json({message:"error while sending mail", success:false, statusbar:500})
        
    }
}
