//database model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const baseSchema = new Schema({
  marker: {
    popup: {
      type: Array,
    },
    coordinates: {
      type: Array,
      required: [true, "Marker is required"],
    }
  },
  
  line: {
    popup: {
      type: Array,
    },
    coordinates: {
      type: Array,
      required: [true, "Line is required"],
    }
  },

  polygon: {
    popup: {
      type: Array,
    },
    coordinates: {
      type: Array,
      required: [true, "Polygon is required"],
    }
  },

  rectangle: {
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
