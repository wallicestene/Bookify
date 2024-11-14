const mongoose = require("mongoose");
const Accommodation = require("../models/accommodationModel");
const multer = require("multer");
const imageDownloader = require("image-downloader");
const { request } = require("express");
const path = require("path");
const fs = require("fs");
const { extname } = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

// const path = req
// add a Accommodation
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
const addAccommodation = (req, res) => {
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
  Accommodation.create({
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
// get all Accommodations by the owner
const getAccommodationByOwner = (req, res) => {
  const { owner } = req.params;
  if (!mongoose.Types.ObjectId.isValid(owner)) {
    return res.status(400).json("No user with that Id");
  }
  Accommodation.find({ owner })
    .then((accommodations) => {
      if (!accommodations) {
        return res.status(404).send("no Accommodations found");
      }
      res.status(200).json(accommodations);
    })
    .catch((error) => {
      res.status(500).json({ error: "failed to fetch the Accommodations" });
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
// find all accommodations
const findAllAccommodations = (req, res) => {
  Accommodation.find()
    .sort({
      updatedAt: -1,
    })
    .then((accommodations) => {
      res.status(200).json(accommodations);
    })
    .catch((error) => {
      res.status(500).json({ error: `Failed to fetch all accommodation error` });
    });
};
// update Accommodation details
const updateAccommodation = (req, res) => {
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
    return res.status(404).json("No accommodation with that id");
  }
  Accommodation.findByIdAndUpdate(id, {
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
    .then((accommodation) => {
      if (!accommodation) {
        res.json(`no accommodation found with that ${id}`);
      }
      res.status(200).json(accommodation);
    })
    .catch((err) => {
      res.status(500).json({ error: "failed to fetch the accommodation" });
    });
};
// find a single rAccommodation
const findOneAccommodation = (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json("No record with that id");
  }
  Accommodation.findById(id)
    .then((accommodation) => {
      if (!accommodation) {
        return res.status(404).json(`no accommodation found with that ${id}`);
      } else {
        res.status(200).json(accommodation);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "failed to fetch the accommodation" });
    });
};
// find/search a rAccommodation by name or address
const searchAccommodation = (req, res) => {
  const { query } = req.query;
  const searchRegex = new RegExp(query, "i");
  Accommodation.find({
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
    .then((accommodations) => {
      if (!accommodations) {
        res.status(404).json({ error: "No matching accommodations found!" });
      }
      res.status(200).json(accommodations);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "error in while searching for Accommodation" });
    });
};
// delete a rAccommodation
const deleteAccommodation = (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json(`No Accommodation with given id : ${id}`);
  }

  Accommodation.findByIdAndDelete(id)

    .then((result) => {
      if (!result) {
        return res.status(400).json({ error: "No such accommodation" });
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "error in deleting the accommodation" });
    });
};
module.exports = {
  addAccommodation,
  findAllAccommodations,
  findOneAccommodation,
  deleteAccommodation,
  uploadImages,
  uploadMiddleware,
  uploadImageByLink,
  uploadMenuImage,
  getAccommodationByOwner,
  updateAccommodation,
  searchAccommodation,
};
