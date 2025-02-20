const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const optionalAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    
    if (!authorization) {
      return next(); // Continue without authentication
    }

    const token = authorization.split(" ")[1];
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    // Continue without setting user
    next();
  }
};

module.exports = optionalAuth;