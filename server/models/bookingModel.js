const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "property",
    required: true,
  },
  checkIn: {
    type: Date,
  },
  checkOut: {
    type: Date,
  },
  guests: {
    type: {
      adults: {
        type: Number,
        default: 1,
      },
      children: {
        type: Number,
        default: 0,
      },
      infants: {
        type: Number,
        default: 0,
      },
    },
  },
  duration: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
});
// indexes for faster booking lookups
bookingSchema.index({ propertyId: 1 });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ propertyId: 1, checkIn: 1, checkOut: 1 });

module.exports = mongoose.model("booking", bookingSchema);
