const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const compression = require("compression");
require("dotenv").config();
require("express-async-errors");

const errorHandler = require("./middleware/errorHandler");

// require routes
const userRoutes = require("./routes/UserRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const bookingRoutes = require("./routes/bookingRoute");
const recommendationRoutes = require("./routes/recommendationRoutes");
const analyticsRoutes = require("./routes/analyticsRoute");

// initializing the app
const app = express();

// CORS configuration - MUST come before rate limiting
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Security: set security HTTP headers with relaxed CSP for local images
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Disable for development to allow local images
  })
);

// Security: rate limiting - more lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 500, // 500 for dev, 100 for production
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Auth rate limiting (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 5 : 20, // 20 for dev, 5 for production
  skipSuccessfulRequests: true,
  message: "Too many authentication attempts, please try again later.",
});
app.use("/user/login", authLimiter);
app.use("/user/signup", authLimiter);

// Middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Security: data sanitization against NoSQL injection
app.use(mongoSanitize());

// Security: prevent HTTP parameter pollution
app.use(hpp());

// Compression middleware
app.use(compression());

// Static files - serve uploads folder
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsPath = path.join(__dirname, "controllers", "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("Created uploads directory");
}

app.use("/uploads", express.static(uploadsPath));

// connecting to mongoDB Database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT} `);
      console.log("Connected to the database");
    });
  })
  .catch((err) => {
    console.error("Error while trying to connect", err.message);
  });

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// All Routes
app.use(userRoutes);
app.use(propertyRoutes);
app.use(bookingRoutes);
app.use(recommendationRoutes);
app.use(analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler (must be last)
app.use(errorHandler);
