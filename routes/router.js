const express = require("express");
const coordinate = require("../models/baseModel");
const router = express.Router();
const checkAuth = require("../middleware/check_auth");

router.route("/").get((req, res) => {
    res.render('map');
});

//save data to mongodb
// save data after authentication
router.route("/save" ).post(checkAuth,(req, res) => {
    const coordinates = new coordinate(req.body);
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
            // console.log(data)
        })
        .catch((error) => {
            res.json(error);
        });
});

// router.route("/delete").delete((req, res) => {
//     coordinate
//         .deleteMany()
//         .then((data) => {
//             res.json(data);
//         })
//         .catch((error) => {
//             res.json(error);
//         });
// });

router.route("/deleteMarker").post((req, res) => {
    console.log(req.body.coordinates);
    coordinate.findOneAndDelete({ coordinates: [parseFloat(req.body.coordinates[0]), parseFloat(req.body.coordinates[1]) ] }).then((data) => {
        res.json(data);
    }
    ).catch((error) => {
        res.json(error);
    }
    );
});

router.route("/update/:id").put((req, res) => {
    coordinate
        .updateOne({_id: req.params
        .id
    }, {
        $set: {
            type: req.body.type,
            color: req.body.color,
            popup: req.body.popup,
            coordinates: req.body.coordinates
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
