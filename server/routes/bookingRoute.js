const express = require("express")
const { addBooking, deleteBooking, getUserBookings } = require("../controllers/bookingController")

const requireAuth = require("../middleware/requireAuthentication")
const router = express.Router()
// require auth for all booking routes

router.post("/api/property/booking", requireAuth, addBooking)
router.get("/api/bookings/", requireAuth, getUserBookings)
router.delete("/api/property/booking/:propertyId", requireAuth, deleteBooking)

module.exports = router;