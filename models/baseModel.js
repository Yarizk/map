//database model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const baseSchema = new Schema({
    type : {
        type: String,
        required: true
    },
    coordinates : {
        type: [Number],
        required: true
    }
});

module.exports = mongoose.model('baseModel', baseSchema);
