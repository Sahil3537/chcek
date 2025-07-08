


const nodemailer = require('nodemailer');
require('dotenv').config();

exports.transporter = async (service) => {


    const email = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS;

    try {
        let transport;

        if (service === "gmail") {
            transport = await nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: email,
                    pass: pass
                }

            })
        }
        else {
            throw new Error('unsupported email service')
        }

        return {
            transport,
            from: `"Support Team" <${process.env.GMAIL_USER}>`
        }

    }
    catch (error) {
        throw error
    }
}
