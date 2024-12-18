const express = require("express");
const {
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
} = require("../controllers/propertyController");
const router = express.Router();

router.post("/api/property", addProperty);
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
router.post(
  "/api/upload-menu-image",
  uploadMiddleware.single("itemImage"),
  uploadMenuImage
);
router.put("/api/property/:id", updateProperty);
router.get("/api/search/property/", searchProperty);
module.exports = router;
