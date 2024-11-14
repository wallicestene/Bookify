const express = require("express");
const {
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
} = require("../controllers/accommodationController");
const router = express.Router();

router.post("/api/accommodation", addAccommodation);
router.get("/api/accommodation", findAllAccommodations);
router.get("/api/accommodation/:id", findOneAccommodation);
router.get("/api/accommodations/owner/:owner", getAccommodationByOwner);
router.delete("/api/accommodation/:id", deleteAccommodation);
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
router.put("/api/accommodation/:id", updateAccommodation);
router.get("/api/search/accommodation/", searchAccommodation);
module.exports = router;
