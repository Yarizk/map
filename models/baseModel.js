//database model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const baseSchema = new Schema({
    marker: {
        type : Array,
        required: [true, 'Marker is required'],

    },
    line : {
        type : Array,
        required: [true, 'Line is required'],

    },
    polygon : {
        type : Array,
        required: [true, 'Polygon is required'],

    },
    rectangle : {
        type : Array,
        required: [true, 'Rectangle is required'],

    }
});
module.exports = mongoose.model('baseModel', baseSchema);
