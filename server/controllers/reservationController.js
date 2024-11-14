const mongoose = require("mongoose");
const Reservation = require("../models/reservationModel");
const moment = require("moment");
const addReservation = (req, res) => {
  const { userId, accommodationId, checkIn, checkOut, guests } = req.body;

  // Checking if the place's already reserved for the given date
  Reservation.findOne({ accommodationId, checkIn, checkOut })
    .then((reservationExists) => {
      if (!reservationExists) {
        // Create a new reservation
        Reservation.create({ userId, accommodationId, checkIn, checkOut, guests })
          .then((reservation) => {
            // Return the created reservation
            res.status(200).json(reservation);
          })
          .catch((error) => {
            res.status(500).json({
              error: `Error occurred while adding reservation: ${error}`,
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
// get Reservation by userId
const getUserReservations = (req, res) => {
  const { userId } = req.query;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(404).json(`no user found with the given Id`);
  }

  Reservation.find({ userId })
    .populate("accommodationId")
    .then((reservations) => {
      if (!reservations) {
        return res.status(404).json("No reservations found!");
      }
      res.status(200).json(reservations);
    })
    .catch(() => {
      res.status(500).json({
        error: "error while finding the reservations",
      });
    });
};
// delete a reservation

const deleteReservation = (req, res) => {
  const { accommodationId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(accommodationId)) {
    res.status(404).json(`no reservations found with the given ID`);
  }

  Reservation.findByIdAndDelete(accommodationId)
    .then((reservation) => {
      if (!reservation) {
        return res.status(404).json("no reservation found");
      } else {
        Table.findByIdAndUpdate(reservation.tableId, { occupied: false })
          .then((updatedTable) => {
            if (!updatedTable) {
              res.status(404).json("No table found");
            } else {
              res.status(200).json(reservation);
            }
          })
          .catch((error) => {
            res.status(500).json({
              error: `Error while trying to update table for reservation deletion Error: ${error}`,
            });
          });
      }
    })
    .catch(() => {
      res.status(500).json({
        error: "error in deleting the reservation",
      });
    });
};
module.exports = {
  addReservation,
  getUserReservations,
  deleteReservation,
};
