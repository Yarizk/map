//database model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const baseSchema = new Schema({
  marker: {
    color : {
      type: Array},
    popup: {
      type: Array,
    },
    coordinates: {
      type: Array,
      required: [true, "Marker is required"],
    }
  },
  
  line: {
    color : {
      type: Array},
    popup: {
      type: Array,
    },
    coordinates: {
      type: Array,
      required: [true, "Line is required"],
    }
  },

  polygon: {
    color : {
      type: Array},
    popup: {
      type: Array,
    },
    coordinates: {
      type: Array,
      required: [true, "Polygon is required"],
    }
  },

  rectangle: {
    color : {
      type: Array},
    popup: {
      type: Array,
    },
    coordinates: {
      type: Array,
      required: [true, "Rectangle is required"],
    }
  }
});
module.exports = mongoose.model("baseModel", baseSchema);
