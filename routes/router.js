const express = require("express");
const coordinate = require("../models/baseModel");
const router = express.Router();
const checkAuth = require("../middleware/check_auth");

router.route("/").get((req, res) => {
    res.render('map');
});

//save data to mongodb
// save data after authentication
router.post("/save", checkAuth, (req, res) => {
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



module.exports = router;
