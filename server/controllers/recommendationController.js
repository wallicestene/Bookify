const Booking = require("../models/bookingModel")
const Property = require("../models/propertyModel")
const searchHistory = require("../models/searchHistoryModel")
const getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id

        // fetch users past bookings
        const pastBookings = await Booking.find({ userId }).populate("propertyId")
        const bookedPropertyIds = pastBookings.map(booking => booking.propertyId._id)

        // Find properties with similar tags and locations as previously booked properties
        let propertyTags = new Set()
        let propertyLocations = new Set()

        pastBookings.forEach(booking => {
            booking.propertyId.tags.forEach(tag => propertyTags.add(tag))
            propertyLocations.add(booking.propertyId.address)
        })

        // query for recommended properties
        const recommendedProperties = await Property.find({
            _id: { $nin: bookedPropertyIds },
            $or: [
                { tags: { $in: Array.from(propertyTags) } },// match properties with similar tags
                { address: { $in: Array.from(propertyLocations) } } // match properties with similar locations
            ]
        }).limit(10) // limit to 10 recommendations

        res.status(200).json(recommendedProperties)


    } catch (error) {
        res.status(500).json({ error: "error while finding recommendations" })
    }
}
const getPersonalizedRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        const userSearches = await searchHistory.find({ userId }).sort({ createdAt: -1 }).limit(5);
        if (!userSearches.length) {
            return res.status(400).json({ error: "No searches found" });
        }

        // Extract search patterns
        let searchAmenities = new Set();
        let searchTags = new Set();
        let searchLocations = new Set();
        let priceRange = { min: Infinity, max: 0 };
        let bedrooms = new Set();
        let guests = new Set();

        userSearches.forEach(search => {
            if (search.amenities) search.amenities.forEach(amenity => searchAmenities.add(amenity));
            if (search.tags) search.tags.forEach(tag => searchTags.add(tag));
            if (search.location) searchLocations.add(search.location);
            if (search.minPrice) priceRange.min = Math.min(priceRange.min, search.minPrice);
            if (search.maxPrice) priceRange.max = Math.max(priceRange.max, search.maxPrice);
            if (search.bedrooms) bedrooms.add(search.bedrooms);
            if (search.guests) guests.add(search.guests);

        });

        // Weighted aggregation pipeline
        const recommendedProperties = await Property.aggregate([
            {
                $match: {
                    $or: [
                        { amenities: { $in: Array.from(searchAmenities) } },
                        { tags: { $in: Array.from(searchTags) } },
                        { address: { $in: Array.from(searchLocations) } },
                        { "whereToSleep.bedroom": { $in: Array.from(bedrooms) } },
                        { guests: { $in: Array.from(guests) } }
                    ],
                    ...(priceRange.min !== Infinity && {
                        price: { $gte: priceRange.min, $lte: priceRange.max }
                    })
                }
            },
            {
                $addFields: {
                    relevanceScore: {
                        $sum: [
                            // Location match (highest weight - 3)
                            {
                                $cond: [
                                    { $in: ["$address", Array.from(searchLocations)] },
                                    3,
                                    0
                                ]
                            },
                            // Tag matches (weight - 2)
                            {
                                $multiply: [
                                    {
                                        $size: {
                                            $setIntersection: ["$tags", Array.from(searchTags)]
                                        }
                                    },
                                    2
                                ]
                            },
                            // Amenity matches (weight - 2)
                            {
                                $multiply: [
                                    {
                                        $size: {
                                            $setIntersection: ["$amenities", Array.from(searchAmenities)]
                                        }
                                    },
                                    2
                                ]
                            },
                            // Bedroom match (weight - 1.5)
                            {
                                $cond: [
                                    { $in: ["$whereToSleep.bedroom", Array.from(bedrooms)] },
                                    1.5,
                                    0
                                ]
                            },
                            // guests match 
                            {
                                $cond: [
                                    { $in: ["$guests", Array.from(guests)] },
                                    1,
                                    0
                                ]
                            }
                            ,
                            // Price range match (weight - 1)
                            {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$price", priceRange.min] },
                                            { $lte: ["$price", priceRange.max] }
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            },
                        ]
                    }
                }

            },
            {
                $match: {
                    relevanceScore: { $gt: 0 } // Only include properties with some relevance
                }
            },
            {
                $sort: { relevanceScore: -1 } // Sort by relevance score
            },
            {
                $limit: 10
            }
        ]);

        res.status(200).json(recommendedProperties);
    } catch (error) {
        res.status(500).json({ error: "Error while finding recommendations: " + error });
    }
};

// get Popular Properties recommendations
const getPopularProperties = async (req, res) => {
    try {
        const popularProperties = await Property.aggregate([
            {
                $lookup: {
                    from: "bookings",
                    localField: "_id",
                    foreignField: "propertyId",
                    as: "bookings"
                }
            },
            {
                $addFields: {
                    bookingCount: { $size: "$bookings" },
                    // Calculating booking frequency (bookings per month)
                    bookingFrequency: {
                        $divide: [
                            { $size: "$bookings" },
                            {
                                $add: [
                                    1,
                                    {
                                        $divide: [
                                            {
                                                $subtract: [
                                                    new Date(),
                                                    "$createdAt"
                                                ]
                                            },
                                            1000 * 60 * 60 * 24 * 30 // Converting to months
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            },
            {
                $match: {
                    bookingCount: { $gt: 0 } // including properties with bookings
                }
            },
            {
                $sort: {
                    bookingFrequency: -1,
                    bookingCount: -1,
                }
            },
            {
                $limit: 8
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    price: 1,
                    address: 1,
                    images: 1,
                    amenities: 1,
                    tags: 1,
                    bookingCount: 1,
                    whereToSleep: 1,
                    bookingFrequency: 1
                }
            }
        ]);

        if (!popularProperties.length) {
            const newestProperties = await Property.find()
                .sort({ createdAt: -1 })
                .limit(8);
            return res.status(200).json(newestProperties);
        }

        res.status(200).json(popularProperties);
    } catch (error) {
        res.status(500).json({
            error: "Error while finding popular properties: " + error.message
        });
    }
};
module.exports = {
    getRecommendations,
    getPersonalizedRecommendations,
    getPopularProperties
}