//database model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const baseSchema = new Schema({
    marker: {
        type : Array,
        required: [true, 'Marker is required'],
        unique: true
    },
    line : {
        type : Array,
        required: [true, 'Line is required'],
        unique: true
    },
    polygon : {
        type : Array,
        required: [true, 'Polygon is required'],
        unique: true
    },
    rectangle : {
        type : Array,
        required: [true, 'Rectangle is required'],
        unique: true
    }
});
module.exports = mongoose.model('baseModel', baseSchema);
