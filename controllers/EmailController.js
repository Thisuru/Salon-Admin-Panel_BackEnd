require('dotenv').config()
const nodemailer = require("nodemailer");
const { createToken } = require('../services/emailService');
const fs = require('fs');
const Handlebars = require("handlebars");
const path = require('path');

const sendSuccessEmail = async (req, res) => {

  try {

    const filePath = path.join(__dirname, "../public/emailTemplate.html");
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = Handlebars.compile(source);

    const replacements = {
      message: req.body.message
    };

    const htmlToSend = template(replacements);

    const APP_EMAIL = process.env.APP_EMAIL
    const APP_PASSWORD = process.env.APP_PASSWORD

    var transporter = nodemailer.createTransport({
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
      html: htmlToSend
    };

    transporter.sendMail(mailOptions, function (error, info) {

      if (error) {
        console.log(error);
      } else {

        console.log('Email sent: ' + info.response);
        res.send({ request: req.body, message: 'Email is sent' })
      }
    });

  } catch (error) {
    console.log(error);
  }

}

//Create JWT one time Register URL
const inviteEmailExpiryToken = async (req, res) => {

  try {

    const token = await createToken(req.body.email)
    if (!token) {
      return res.status(400).json({
        status: false,
        message: 'JWT token not created'
      });
    } else {
      res.send({ token: token })
    }



  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message || "Error Update user information" })
  }
}

module.exports = {
  sendSuccessEmail,
  inviteEmailExpiryToken
}