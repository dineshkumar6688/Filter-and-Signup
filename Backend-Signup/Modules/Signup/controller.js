require("dotenv").config({ path: "../../.env" });
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");
var { google } = require("googleapis");
const fs = require("fs");
var path = require("path");

require("./user_schema");

const Register = mongoose.model("signup");

exports.add_user = async (req, res) => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
  const htmlBody = fs.readFileSync(path.join(__dirname, "./signup.html"));
  Register.find({ user_mail: req.body.user_mail })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        res.status(409).json({
          success: false,
          message: "Mail already exists!",
        });
      } else {
        bcrypt.hash(req.body.user_password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              success: false,
              message: err,
            });
          } else {
            var newUser = {
              user_mail: req.body.user_mail,
              user_password: hash,
            };

            var user = new Register(newUser);

            user.save().then(async () => {
              const accessToken = await oAuth2Client.getAccessToken();
              let transporter = nodemailer.createTransport({
                service: process.env.SERVICE,
                auth: {
                  type: process.env.TYPE,
                  user: process.env.EMAIL_ID, // generated ethereal user
                  clientId: process.env.CLIENT_ID,
                  clientSecret: process.env.CLIENT_SECRET,
                  refreshToken: process.env.REFRESH_TOKEN,
                  accessToken: accessToken, // generated ethereal password
                },
              });

              await transporter.sendMail({
                from: process.env.EMAIL_ID,
                to: req.body.user_mail,
                subject: "Sign Successful",
                html: htmlBody,
              });
              res.status(200).json({
                success: true,
                message: "Signup Successful!!",
              });
            });
          }
        });
      }
    });
};
