//
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//register
router.route("/").post((req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
        }

        const newUser = new User({
            username: username,
            email: email,
            password: hash
        });

        newUser
            .save()
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.json(error);
            });
    });
});

module.exports = router;
