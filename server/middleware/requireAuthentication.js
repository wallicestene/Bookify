const jwt = require("jsonwebtoken");
const User = require("../models/userModel")
const requireAuth = async (req, res, next) => {
  // verify authentication
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  const token = authorization.split(" ")[1];
  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({ _id }).select("_id")
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: 'Session expired. Please log in again.' })
    }
    return res.status(400).json({ error: "Invalid Token" });
  }
};
module.exports = requireAuth