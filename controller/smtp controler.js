const transporter = require('../mail config/smtp_config');
require('dotenv').config();
const fs = require('fs');



exports.sendEmail = async(req, res)=>{
        try{

            const {to, subject }= req.body

             const text= req.body.body || 'This is a default message.';
             const htmlBody = req.body.html ? req.body.html : null;

            const service =req.body.service||"gmail"

            const config = transporter(service)


            if(!config){
                return res.status(400).json({succss:false, message:"invalid service"})
            }
                    

            const mailOptions ={
                from:config.from,
                to, 
                subject, 
                html :htmlBody || undefined,
                text:text
            }

            const info = await config.transporter.sendMail(mailOptions)
                res.json({ message: 'Mail sent successfully', success: true, data: info });

        }
        catch (error) {
    console.error('Send mail error:', error.message);
    res.status(500).json({ message: 'Failed to send email', success: false });
  }
}