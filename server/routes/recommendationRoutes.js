const express = require("express")
const requireAuth = require("../middleware/requireAuthentication");
const { getRecommendations, getPersonalizedRecommendations } = require("../controllers/recommendationController");

const router = express.Router()

router.get("/api/recommendations", requireAuth, getRecommendations)
router.get("/api/personalized/recommendations", requireAuth, getPersonalizedRecommendations)


module.exports = router;
