//
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// register
router.post("/register", (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: email }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                res.send("User already exists");
            } else {
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    const newUser = new User({
                        email: email,
                        username: username,
                        password: hash,
                    });
                    if(newUser.username === "" || newUser.password === "" || newUser.email === ""){
                        res.send("Please fill all fields")
                    }else{


                    newUser.save((err) => {
                        if (err) {
                            res.send(err.message);
                        } else {
                            res.send("User registered");
                        }
                    });
                }
                });
            }
        }
    });
});

// login
router.route("/login").post((req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, (err, result) => {
          if (result === true) {
            res.send("Login Successful");
          } else {
            res.send("Wrong Password");
          }
        });
      } else {
        res.send("Email does not exist");
      }
    }
  });
});

module.exports = router;





module.exports = router;
