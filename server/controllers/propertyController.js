const mongoose = require("mongoose");
const Property = require("../models/propertyModel");
const multer = require("multer");
const imageDownloader = require("image-downloader");
const { request } = require("express");
const path = require("path");
const fs = require("fs");
const { extname } = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

// const path = req
// add a Property
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
const addProperty = (req, res) => {
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
  Property.create({
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
  })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};
// get all Properties by the owner
const getPropertyByOwner = (req, res) => {
  const { owner } = req.params;
  if (!mongoose.Types.ObjectId.isValid(owner)) {
    return res.status(400).json("No user with that Id");
  }
  Property.find({ owner })
    .then((properties) => {
      if (!properties) {
        return res.status(404).send("no Properties found");
      }
      res.status(200).json(properties);
    })
    .catch((error) => {
      res.status(500).json({ error: "failed to fetch the Properties" });
    });
};
// custom filename and destination
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, "photo" + Date.now() + path.extname(file.originalname));
  },
});
const uploadMiddleware = multer({
  storage,
});
// uploading images
const uploadImages = (req, res) => {
  const uploadedImages = [];
  for (let i = 0; i < req.files.length; i++) {
    const { filename } = req.files[i];
    const params = {
      Bucket: bucketName,
      Key: filename,
      Body: fs.readFileSync(req.files[i].path),
      ContentType: req.files[i].mimetype,
    };
    const command = new PutObjectCommand(params);
    s3.send(command, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    });
    uploadedImages.push(
      `https://bookify-app-bucket.s3.amazonaws.com/${filename}`
    );
  }
  res.json(uploadedImages);
};
// uploading menu item image
const uploadMenuImage = (req, res) => {
  const { filename } = req.file;
  return res.json(filename);
};

const uploadImageByLink = (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  const filePath = `${__dirname}/uploads/${newName}`;

  imageDownloader
    .image({
      url: link,
      dest: filePath,
    })
    .then(() => {
      // Upload the image to S3
      const fileStream = fs.createReadStream(filePath);
      const params = {
        Bucket: bucketName,
        Key: newName,
        Body: fileStream,
        ContentType: "image/jpeg",
      };
      const command = new PutObjectCommand(params);

      s3.send(command, (err, data) => {
        if (err) {
          console.error("Error uploading image to S3:", err);
          res.status(500).json({ error: "Failed to upload image to S3" });
        } else {
          console.log("Image uploaded successfully.");
          //Deleting the local file after uploading to S3
          fs.unlinkSync(filePath);

          return res.json(
            `https://bookify-app-bucket.s3.amazonaws.com/${newName}`
          );
        }
      });
    })
    .catch((err) => {
      console.error("Error downloading image:", err);
      res.status(500).json({ error: "Failed to download image" });
    });
};
// find all properties
const findAllProperties = (req, res) => {
  Property.find()
    .sort({
      updatedAt: -1,
    })
    .then((properties) => {
      res.status(200).json(properties);
    })
    .catch((error) => {
      res.status(500).json({ error: `Failed to fetch all property error` });
    });
};
// update Property details
const updateProperty = (req, res) => {
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
    return res.status(404).json("No property with that id");
  }
  Property.findByIdAndUpdate(id, {
    name,
    address,
    description,
    images,
    whereToSleep,
    guests,
    price,
    amenities,
    tags,
  })
    .then((property) => {
      if (!property) {
        res.json(`no property found with that ${id}`);
      }
      res.status(200).json(property);
    })
    .catch((err) => {
      res.status(500).json({ error: "failed to fetch the property" });
    });
};
// find a single rProperty
const findOneProperty = (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json("No record with that id");
  }
  Property.findById(id)
    .then((property) => {
      if (!property) {
        return res.status(404).json(`no property found with that ${id}`);
      } else {
        res.status(200).json(property);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "failed to fetch the property" });
    });
};
// find/search a rProperty by name or address
const searchProperty = (req, res) => {
  const { query } = req.query;
  const searchRegex = new RegExp(query, "i");
  Property.find({
    $or: [
      {
        name: searchRegex,
      },
      {
        address: searchRegex,
      },
    ],
  })
    .sort({
      updatedAt: -1,
    })
    .then((properties) => {
      if (!properties) {
        res.status(404).json({ error: "No matching properties found!" });
      }
      res.status(200).json(properties);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "error in while searching for Property" });
    });
};
// delete a rProperty
const deleteProperty = (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json(`No Property with given id : ${id}`);
  }

  Property.findByIdAndDelete(id)

    .then((result) => {
      if (!result) {
        return res.status(400).json({ error: "No such property" });
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "error in deleting the property" });
    });
};
module.exports = {
  addProperty,
  findAllProperties,
  findOneProperty,
  deleteProperty,
  uploadImages,
  uploadMiddleware,
  uploadImageByLink,
  uploadMenuImage,
  getPropertyByOwner,
  updateProperty,
  searchProperty,
};
