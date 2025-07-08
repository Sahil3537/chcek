

const { v4: uuidv4 } = require('uuid');
const trackingModel = require('../model/tracker.model');
const emailTemplate = require('../views/views');
require('dotenv').config()


const base_url = process.env.BASE_URL

//crate function aadd email as argumet

exports.generateToken= async (email)=>{
try{
    //create token 
    const token = uuidv4()


    //save the token created by uuid in db 
    const saveToken = await trackingModel.saveTracking(email, token)

    //imprt html token here which has template
    const htmlToken = emailTemplate(token)
  
      return htmlToken


}
catch(Err){
    throw Err
}
}



//save the token to db 

//return the pixel 
