require('dotenv').config()
const nodemailer = require("nodemailer");

const sendSuccessEmail = async (req, res) => {
  
    try {
  
        console.log("Email Request body: ", req.body);
        
        const APP_EMAIL = process.env.APP_EMAIL 
        const APP_PASSWORD = process.env.APP_PASSWORD
  
        var transporter =  nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: APP_EMAIL,
            pass: APP_PASSWORD
          }
        });
  
        var mailOptions = {
          from: APP_EMAIL,
          to: req.body.email,
          subject: 'Sending Email from Admin Panel',
          text: req.body.message
        };
  
        transporter.sendMail(mailOptions, function(error, info){
  
          if (error) {
            console.log(error);
          } else {
  
            console.log('Email sent: ' + info.response);
            res.send({request: req.body, message : 'Email is sent'})
          }
        });
      
    } catch (error) {
        console.log(error);
    }
    
  }

  module.exports = {
    sendSuccessEmail
  }