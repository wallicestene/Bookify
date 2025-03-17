const Property = require("../models/propertyModel");
const Booking = require("../models/bookingModel");

const getOwnerAnalytics = async (req, res) => {
    try {
        const owner = req.user.id

        // get Properties Owned by the user
        const properties = await Property.find({ owner })
        const propertyIds = properties.map(property => property._id)


        // get Bookings for the properties
        const bookings = await Booking.find({ propertyId: { $in: propertyIds } }).populate("propertyId")

        // calculating total revenue
        const totalRevenue = bookings.reduce((sum, booking) => {
            return sum + booking.propertyId.price
        }, 0)

        // calculate bookings by month
        const bookingsByMonth = Array(12).fill(0).map((_, i) => {
            return {
                month: new Date(0, i).toLocaleString('default', { month: 'short' }),
                count: 0
            }
        })
        bookings.forEach(booking => {
            const month = new Date(booking.checkIn).getMonth()
            bookingsByMonth[month].count++
        })

        // Calculate revenue by month
        const revenueByMonth = Array(12).fill(0).map((_, i) => {
            return {
                month: new Date(0, i).toLocaleString('default', { month: 'short' }),
                revenue: 0
            };
        });

        bookings.forEach(booking => {
            const month = new Date(booking.checkIn).getMonth();
            revenueByMonth[month].revenue += booking.propertyId.price
        });

        // top Performing Properties

        const propertyPerformance = {}

        bookings.forEach(booking => {
            const propId = booking.propertyId._id.toString()
            if (!propertyPerformance[propId]) {
                propertyPerformance[propId] = {
                    id: propId,
                    name: booking.propertyId.name,
                    address: booking.propertyId.address,
                    bookings: 0,
                    revenue: 0
                }
            }
            propertyPerformance[propId].bookings++
            propertyPerformance[propId].revenue += booking.propertyId.price
        })

        const topProperties = Object.values(propertyPerformance).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

        // calculate rate of occupancy
        const totalDays = properties.length * 365
        const occupiedDays = bookings.reduce((sum, booking) => {
            const checkIn = new Date(booking.checkIn)
            const checkOut = new Date(booking.checkOut)
            const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
            return sum + days
        }, 0)
        const occupancyRate = Math.round((occupiedDays / totalDays) * 100) || 0

        res.status(200).json({
            totalBookings: bookings.length,
            totalRevenue,
            revenueByMonth,
            occupancyRate,
            bookingsByMonth,
            topProperties
        })
    } catch (error) {
        console.error("Analytics error:", error);
        res.status(500).json({ error: "Error fetching analytics data" });

    }
}
module.exports = { getOwnerAnalytics }