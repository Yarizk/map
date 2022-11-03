const express = require("express");
//const coordinates = require("../models/baseModels");
const router = express.Router();

// router.route("/save").post((req, res) => {
//   console.log(req.body);
//   res.send("success");
  
// });


//save data to mongodb
router.route("/save").post((req, res) => {
    const coordinates = new coordinates({
        marker: req.body.marker,
        line: req.body.line,
        polygon: req.body.polygon,
        rectangle: req.body.rectangle
    });
    coordinates
        .save()
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.json(error);
        });
});
module.exports = router;
