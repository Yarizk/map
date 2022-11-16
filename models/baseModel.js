//database model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const baseSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  popup: {
    type: String,
  },
  coordinates: {
    type: Array,
  },
});
module.exports = mongoose.model("baseModel", baseSchema);
