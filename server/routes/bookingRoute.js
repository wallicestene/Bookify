const express = require("express")
const { addBooking, deleteBooking, getUserBookings } = require("../controllers/bookingController")

const requireAuth = require("../middleware/requireAuthentication")
const router = express.Router()
// require auth for all booking routes
router.use(requireAuth)
router.post("/api/property/booking", addBooking)
router.get("/api/bookings/", getUserBookings)
router.delete("/api/property/booking/:propertyId", deleteBooking)

module.exports = router;