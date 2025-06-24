const nodemailer= require('nodemailer')
const fs = require("fs")
const path = require('path')

require('dotenv').config()


const emailTemplate = fs.readFileSync(path.join(__dirname, '../public/index.html'),'utf-8')


function transporter(service){

    try{
        console.log('>>>>',process.env.GMAIL_PASS,process.env.GMAIL_USER );
        
        if(service==="gmail"){
            const transporter =  nodemailer.createTransport({
                 
                       service:"gmail",
                    auth:{
                       user: process.env.GMAIL_USER,
                  pass: process.env.GMAIL_PASS
                    }
                  
            })
            return{
                transporter:transporter,
                template:emailTemplate,
                 from: `"Support Team" <${process.env.GMAIL_USER}>`

            }
        }
    }

    catch(error){
        throw error
    }
  
}
   
   


module.exports= transporter;