const nodemailer= require('nodemailer')
const fs = require("fs")
const path = require('path')


const emailTemplate = fs.readFileSync(path.join(__dirname, '../public/index.html'),' utf-8')


function transporter(service){
    try{
        if(service==="gmail"){
            const transporter =  nodemailer.createTransport({
                 
                       service:"gmail",
                    auth:{
                       user: process.env.GMAIL_USER,
                  pass: process.env.GMAIL_PASS
                    },
                  
            })
            return{
                transporter:transporter,
                temlate:emailTemplate,
                 from: `"Support Team" <${process.env.GMAIL_USER}>`

            }
        }
    }

    catch(error){
        throw error
    }
  
}