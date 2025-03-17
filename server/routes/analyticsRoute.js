const express = require('express');
const router = express.Router();
const requireAuth = require("../middleware/requireAuthentication");
const { getOwnerAnalytics } = require('../controllers/analytics');

router.get("/api/analytics/owner", requireAuth, getOwnerAnalytics)

module.exports = router;