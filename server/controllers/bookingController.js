const mongoose = require("mongoose");
const Booking = require("../models/bookingModel");
const moment = require("moment");
const addBooking = (req, res) => {
  const { userId, propertyId, checkIn, checkOut, guests } = req.body;

  // Checking if the place's already reserved for the given date
  Booking.findOne({ propertyId, checkIn, checkOut })
    .then((bookingExists) => {
      if (!bookingExists) {
        // Create a new booking
        Booking.create({ userId, propertyId, checkIn, checkOut, guests })
          .then((booking) => {
            // Return the created booking
            res.status(200).json(booking);
          })
          .catch((error) => {
            res.status(500).json({
              error: `Error occurred while adding booking: ${error}`,
            });
          });
      } else {
        throw Error("This place is already booked for that date!");
      }
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};
// get Booking by userId
const getUserBookings = (req, res) => {
  const { userId } = req.query;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(404).json(`no user found with the given Id`);
  }

  Booking.find({ userId })
    .populate("propertyId")
    .then((bookings) => {
      if (!bookings) {
        return res.status(404).json("No bookings found!");
      }
      res.status(200).json(bookings);
    })
    .catch(() => {
      res.status(500).json({
        error: "error while finding the bookings",
      });
    });
};
// delete a booking

const deleteBooking = (req, res) => {
  const { propertyId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    res.status(404).json(`no bookings found with the given ID`);
  }

  Booking.findByIdAndDelete(propertyId)
    .then((booking) => {
      if (!booking) {
        return res.status(404).json("no booking found");
      } else {
        Table.findByIdAndUpdate(booking.tableId, { occupied: false })
          .then((updatedTable) => {
            if (!updatedTable) {
              res.status(404).json("No table found");
            } else {
              res.status(200).json(booking);
            }
          })
          .catch((error) => {
            res.status(500).json({
              error: `Error while trying to update table for booking deletion Error: ${error}`,
            });
          });
      }
    })
    .catch(() => {
      res.status(500).json({
        error: "error in deleting the booking",
      });
    });
};
module.exports = {
  addBooking,
  getUserBookings,
  deleteBooking,
};
