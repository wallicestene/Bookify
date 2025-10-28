const mongoose = require("mongoose");
const Property = require("../models/propertyModel");
const multer = require("multer");
const imageDownloader = require("image-downloader");
const path = require("path");
const fs = require("fs").promises;
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const Booking = require("../models/bookingModel");
const SearchHistory = require("../models/searchHistoryModel");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
require("dotenv").config();

// S3 configuration
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretKey = process.env.SECRET_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  region: bucketRegion,
});

// Add a property
const addProperty = asyncHandler(async (req, res) => {
  const {
    owner,
    name,
    address,
    description,
    images,
    whereToSleep,
    guests,
    price,
    amenities,
    tags,
  } = req.body;

  const property = await Property.create({
    owner,
    name,
    address,
    description,
    images,
    whereToSleep,
    guests,
    price,
    amenities,
    tags,
  });

  res
    .status(201)
    .json(new ApiResponse(201, property, "Property created successfully"));
});

// Get all properties by owner
const getPropertyByOwner = asyncHandler(async (req, res) => {
  const { owner } = req.params;

  if (!mongoose.Types.ObjectId.isValid(owner)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const properties = await Property.find({ owner }).sort({ updatedAt: -1 });

  res
    .status(200)
    .json(
      new ApiResponse(200, properties, "Properties fetched successfully")
    );
});

// Multer configuration
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, "photo" + Date.now() + path.extname(file.originalname));
  },
});

const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new ApiError(400, "Only image files are allowed"));
    }
  },
});

// Upload images to S3
const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No files uploaded");
  }

  const uploadPromises = req.files.map(async (file) => {
    const { filename, path: filePath, mimetype } = file;

    const fileContent = await fs.readFile(filePath);

    const params = {
      Bucket: bucketName,
      Key: filename,
      Body: fileContent,
      ContentType: mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Clean up local file
    await fs.unlink(filePath);

    return `https://${bucketName}.s3.amazonaws.com/${filename}`;
  });

  const uploadedImages = await Promise.all(uploadPromises);

  res
    .status(200)
    .json(new ApiResponse(200, uploadedImages, "Images uploaded successfully"));
});


// Upload image by link
const uploadImageByLink = asyncHandler(async (req, res) => {
  const { link } = req.body;

  if (!link) {
    throw new ApiError(400, "Image link is required");
  }

  const newName = "photo" + Date.now() + ".jpg";
  const filePath = `${__dirname}/uploads/${newName}`;

  await imageDownloader.image({
    url: link,
    dest: filePath,
  });

  const fileStream = await fs.readFile(filePath);
  const params = {
    Bucket: bucketName,
    Key: newName,
    Body: fileStream,
    ContentType: "image/jpeg",
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  // Clean up local file
  await fs.unlink(filePath);

  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${newName}`;

  res
    .status(200)
    .json(new ApiResponse(200, imageUrl, "Image uploaded successfully"));
});

// Find all properties
const findAllProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find().sort({ updatedAt: -1 });

  res
    .status(200)
    .json(
      new ApiResponse(200, properties, "Properties fetched successfully")
    );
});

// Update property
const updateProperty = asyncHandler(async (req, res) => {
  const {
    name,
    address,
    description,
    images,
    whereToSleep,
    guests,
    price,
    amenities,
    tags,
  } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(404, "Invalid property ID");
  }

  const property = await Property.findByIdAndUpdate(
    id,
    {
      name,
      address,
      description,
      images,
      whereToSleep,
      guests,
      price,
      amenities,
      tags,
    },
    { new: true, runValidators: true }
  );

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, property, "Property updated successfully"));
});

// Find one property
const findOneProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(404, "Invalid property ID");
  }

  const property = await Property.findById(id);

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, property, "Property fetched successfully"));
});

// const searchProperty =  (req, res) => {
//   const { query } = req.query;
//   const searchRegex = new RegExp(query, "i");
//   Property.find({
//     $or: [
//       {
//         name: searchRegex,
//       },
//       {
//         address: searchRegex,
//       },
//     ],
//   })
//     .sort({
//       updatedAt: -1,
//     })
//     .then((properties) => {
//       if (!properties) {
//         res.status(404).json({ error: "No matching properties found!" });
//       }
//       res.status(200).json(properties);
//     })
//     .catch((error) => {
//       res
//         .status(500)
//         .json({ error: "error in while searching for Property" });
//     });
// };

// Delete a property
const deleteProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(404, "Invalid property ID");
  }

  const result = await Property.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(404, "Property not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, result, "Property deleted successfully"));
});

// Search properties with filters
const searchProperty = asyncHandler(async (req, res) => {
  const {
    location,
    minPrice,
    maxPrice,
    amenities,
    tags,
    guests,
    bedrooms,
    beds,
    checkIn,
    checkOut,
  } = req.query;

  const userId = req.user?.id;

  // Build search query
  const query = {};

  // Location search (case-insensitive)
  if (location) {
    query.address = { $regex: location, $options: "i" };
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {
      ...(minPrice && { $gte: parseFloat(minPrice) }),
      ...(maxPrice && { $lte: parseFloat(maxPrice) }),
    };
  }

  // Amenities filter
  if (amenities) {
    const amenitiesArray = amenities.split(",").map((a) => a.trim());
    query.amenities = { $all: amenitiesArray };
  }

  // Tags filter
  if (tags) {
    const tagsArray = tags.split(",").map((t) => t.trim());
    query.tags = { $in: tagsArray };
  }

  // Guests filter
  if (guests) {
    query.guests = { $gte: parseInt(guests, 10) };
  }

  // Bedrooms filter
  if (bedrooms) {
    query["whereToSleep.bedroom"] = { $gte: parseInt(bedrooms, 10) };
  }

  // Beds filter
  if (beds) {
    query.$expr = {
      $gte: [
        {
          $sum: [
            { $ifNull: ["$whereToSleep.sleepingPosition.kingBed", 0] },
            { $ifNull: ["$whereToSleep.sleepingPosition.queenBed", 0] },
            { $ifNull: ["$whereToSleep.sleepingPosition.sofa", 0] },
            { $ifNull: ["$whereToSleep.sleepingPosition.singleBed", 0] },
          ],
        },
        parseInt(beds, 10),
      ],
    };
  }

  // Availability filter (exclude booked properties)
  if (checkIn && checkOut) {
    const bookedProperties = await Booking.find({
      $or: [
        {
          checkIn: { $lt: new Date(checkOut) },
          checkOut: { $gt: new Date(checkIn) },
        },
      ],
    }).select("propertyId");

    const bookedPropertyIds = bookedProperties.map(
      (booking) => booking.propertyId
    );
    query._id = { $nin: bookedPropertyIds };
  }

  const properties = await Property.find(query).sort({ updatedAt: -1 });

  // Save search history if user is authenticated
  if (userId) {
    await SearchHistory.create({
      userId,
      location,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      amenities: amenities ? amenities.split(",").map((a) => a.trim()) : [],
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      guests: guests ? parseInt(guests) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
    });
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        properties,
        `Found ${properties.length} properties`
      )
    );
});

module.exports = {
  addProperty,
  findAllProperties,
  findOneProperty,
  deleteProperty,
  uploadImages,
  uploadMiddleware,
  uploadImageByLink,
  getPropertyByOwner,
  updateProperty,
  searchProperty,
};

