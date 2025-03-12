const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
    required: true,
  },
  whereToSleep: {
    type: [
      {
        bedroom: {
          type: Number,
          required: true,
        },
        sleepingPosition: {
          type: {
            kingBed: {
              type: Number,
              default: 0,
            },
            queenBed: {
              type: Number,
              default: 0,
            },
            sofa: {
              type: Number,
              default: 0,
            },
            singleBed: {
              type: Number,
              default: 0,
            },
          },
        },
      },
    ],
  },
  guests: {
    type: Number,
  },
  price: {
    type: Number,
  },
  amenities: {
    type: [String],
  },
  tags: {
    type: [String],
  },
},{
  timestamps: true
});
// indexes for search and recommendations
propertySchema.index({ address: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ tags: 1 });
propertySchema.index({ amenities: 1 });
propertySchema.index({ 
  address: 1, 
  price: 1, 
  "whereToSleep.bedroom": 1 
});


// index for location searches
propertySchema.index({ address: "text" });
module.exports = mongoose.model("property", propertySchema);
