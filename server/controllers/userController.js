const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// Generate JWT token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "10d" });
};

// User login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.login(email, password);

  const token = createToken(user._id);

  const userData = {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    token,
    userId: user._id,
    createdAt: user.createdAt,
  };

  res
    .status(200)
    .json(new ApiResponse(200, userData, "Login successful"));
});

// User signup
const signupUser = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  const user = await User.signup(first_name, last_name, email, password);

  const token = createToken(user._id);

  const userData = {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    token,
    userId: user._id,
    createdAt: user.createdAt,
  };

  res
    .status(201)
    .json(new ApiResponse(201, userData, "Account created successfully"));
});

module.exports = {
  loginUser,
  signupUser,
};
