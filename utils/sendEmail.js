const nodemailer = require("nodemailer")
const logger = require("../logger")
require('dotenv').config()

const sendEmail = async (email, token) => {
    try {

        console.log({
            user : process.env.EMAIL_USER,
            pass : process.env.PASS
        })

        let mail = nodemailer.createTransport({
            host : process.env.HOST,
            service : process.env.SERVICE,
            auth: {
                user : process.env.EMAIL_USER,
                pass : process.env.PASS
            }
        })

        // console.log(mail)
        let mailOptions = {
            from: process.env.USER,
            to: email,
            subject: 'Reset password',
            html: '<p>You requested for reset password, kindly use this <a href="http://localhost:1286/password-reset-link?token=' + token + '?email='+email+'">link</a> to reset your password</p>'
        };
    
        await mail.sendMail(mailOptions, (error) => {
            if (error) {
                logger.error(`Email not sent`, error)
            } else {
                logger.info("Email sent succesfully")
            }
        })

    } catch (error) {
        logger.error(error.message, "Email not sent")
        // console.log(error)
    }   
}
module.exports = sendEmail
