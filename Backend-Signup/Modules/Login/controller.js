require("dotenv").config();
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

const Register = mongoose.model("signup");

exports.user_login = async (req, res, next) => {
  Register.find({
    user_mail: req.body.user_mail,
  })
    .exec()
    .then(async (user) => {
      if (user.length < 1) {
        res.status(401).json({
          success: false,
          message: "User does not exist!",
        });
      } else {
        bcrypt.compare(
          req.body.user_password,
          user[0].user_password,
          (err, result) => {
            if (err) {
              res.status(500).json({
                success: false,
                message: err,
              });
            }
            if (result) {
              res.status(200).json({
                success: true,
                message: "Successfully logged in!!",
              });
            } else {
              res.status(401).json({
                success: false,
                message: "Password doesn't match",
              });
            }
          }
        );
      }
    });
};
