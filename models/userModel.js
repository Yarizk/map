//user schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    // email username password required
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
var User = mongoose.model('User', userSchema);
module.exports = User;