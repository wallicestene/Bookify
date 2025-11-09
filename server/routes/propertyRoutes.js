const express = require("express");
const {
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
} = require("../controllers/propertyController");
const optionalAuth = require("../middleware/optionalAuth");
const { validate, propertySchema } = require("../utils/validation");
const router = express.Router();

router.post("/api/property", validate(propertySchema), addProperty);
router.get("/api/property", findAllProperties);
router.get("/api/property/:id", findOneProperty);
router.get("/api/properties/owner/:owner", getPropertyByOwner);
router.delete("/api/property/:id", deleteProperty);
router.post(
  "/api/upload-images",
  uploadMiddleware.array("images", 100),
  uploadImages
);
router.post("/api/upload-by-link", uploadImageByLink);
router.put("/api/property/:id", validate(propertySchema), updateProperty);
router.get("/api/search/property/", optionalAuth, searchProperty);
module.exports = router;
