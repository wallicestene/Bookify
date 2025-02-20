const mongoose = require("mongoose");
const Schema = mongoose.Schema

const searchHistorySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    location: {
        type: String,
    },
    minPrice: {
        type: Number
    },
    maxPrice: {
        type: Number
    },
    amenities: {
        type: [String]
    },
    tags: {
        type: [String]
    },
    guests: {
        type: Number
    },
    bedrooms: {
        type: Number
    },
}, { timestamps: true });
// indexes for recommendation queries
searchHistorySchema.index({ userId: 1, createdAt: -1 });
searchHistorySchema.index({
    userId: 1,
    tags: 1,
    amenities: 1
});

module.exports = mongoose.model("searchHistory", searchHistorySchema)