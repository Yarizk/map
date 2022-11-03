const express = require("express");
//const coordinates = require("../models/baseModels");
const router = express.Router();

router.route("/save").post((req, res) => {
  console.log(req.body);
  res.send("success");
});


module.exports = router;
