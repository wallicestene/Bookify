const express = require("express")
const requireAuth = require("../middleware/requireAuthentication");
const { getRecommendations, getPersonalizedRecommendations, getPopularProperties } = require("../controllers/recommendationController");

const router = express.Router()

router.get("/api/popular-properties", getPopularProperties)
router.get("/api/recommendations", requireAuth, getRecommendations)
router.get("/api/personalized/recommendations", requireAuth, getPersonalizedRecommendations)


module.exports = router;
