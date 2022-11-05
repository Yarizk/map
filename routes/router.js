const express = require("express");
const coordinate = require("../models/baseModel");
const router = express.Router();



//save data to mongodb
router.route("/save").post((req, res) => {
    const coordinates = new coordinate({
        marker: req.body.marker,
        line: req.body.line,
        polygon: req.body.polygon,
        rectangle: req.body.rectangle
    });
    console.log(coordinates);
    coordinates
        .save()
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.json(error);
        });
});

//route to get data from mongodb
router.route("/get").get((req, res) => {
    coordinate
        .find()
        .then((data) => {
            res.json(data);
            console.log(data)
        })
        .catch((error) => {
            res.json(error);
        });
});

//get data from login page
router.route("/login").post((req, res) => {
    console.log(req.body);
    res.json(req.body);
});

module.exports = router;
