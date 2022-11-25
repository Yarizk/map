//
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;


const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// register


router.route("/register").get((req, res) => {
  res.render("register");
})

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
                            res.send("Please enter valid email address");
                        } else {
                            res.redirect("/login");
                        }
                    });
                }
                });
            }
        }
    });
});


// login
router.route("/login").get((req, res) => {
  res.render("login");
})

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
            const payload = {
              _id: foundUser._id,
              username: foundUser.username,
            };
            const token = jwt.sign({ payload }, process.env.SECRET, {expiresIn : "1h"});
            res.cookie("username", foundUser.username);
            res.cookie("jwt", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            // console.log(token)
            res.redirect("/map");

          
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

router.route("/logout").get((req, res) => {
  res.clearCookie("username");
  res.clearCookie("jwt");
  res.redirect("/");
});


module.exports = router;

