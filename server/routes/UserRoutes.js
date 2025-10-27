const express = require("express");
const { signupUser, loginUser } = require("../controllers/userController");
const { validate, loginSchema, signupSchema } = require("../utils/validation");
const router = express.Router();

// Login route
router.post("/user/login", validate(loginSchema), loginUser);

// Signup route
router.post("/user/signup", validate(signupSchema), signupUser);

module.exports = router;