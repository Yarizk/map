const express = require("express");
const coordinate = require("../models/baseModel");
const router = express.Router();
const checkAuth = require("../middleware/check_auth");

router.route("/").get((req, res) => {
    res.render("home");
});

router.route("/game").get((req, res) => {
    res.render("game");
    });

router.route("/map").get((req, res) => {
    res.render('map');
});

//save data to mongodb
// save data after authentication
router.route("/save" ).post(checkAuth,(req, res) => {
    const coordinates = new coordinate(req.body);
    //console.log(coordinates);
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
            // console.log(data)
        })
        .catch((error) => {
            res.json(error);
        });
});

router.route("/deleteAll").delete((req, res) => {
    coordinate
        .deleteMany()
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.json(error);
        });
});

router.route("/delete/:coordinate").delete((req, res) => {
    let store = [];
    let arr = req.params.coordinate.split(",");
    for (let i = 0; i < arr.length; i+=2) {
        store.push([parseFloat(arr[i]), parseFloat(arr[i + 1])]);
    }
    coordinate
        .deleteOne({ coordinates : store })
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.json(error);
        });
});

router.route("/deleteMarker/:lat&:lang").delete((req, res) => {
    coordinate.findOneAndDelete({ coordinates: [parseFloat(req.params.lat), parseFloat(req.params.lang) ] }).then((data) => {
        res.json(data);
    }
    ).catch((error) => {
        res.json(error);
    }
    );
});

router.route("/updateMarker/:lat&:lang").put((req, res) => {
    coordinate
        .findOneAndUpdate({ coordinates: [parseFloat(req.params.lat), parseFloat(req.params.lang) ] }, {
        $set: {
            color: req.body.color,
            popup: req.body.popup,
        }
    })
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.json(error);
        });
});

router.route("/update/:coordinate").put((req, res) => {
    let store = [];
    let arr = req.params.coordinate.split(",");
    for (let i = 0; i < arr.length; i+=2) {
        store.push([parseFloat(arr[i]), parseFloat(arr[i + 1])]);
    }
    coordinate
        .findOneAndUpdate({ coordinates: store }, {
        $set: {
            color: req.body.color,
            popup: req.body.popup,
        }
    })
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.json(error);
        });
});

router.route("/get/:id").get((req, res) => {
        
    coordinate
        .findOne({_id: req.params.id})
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.json(error);
        });
});

router.route("/get/:type").get((req, res) => {
    coordinate
        .find({type: req.params.type})
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.json(error);
        });
});


module.exports = router;
