const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logger");
const ErrorHandler = require("./middleware/ErrorHandler");
const AppError = require("./utils/AppError");
const routes = require("./routes/index");

// Start express app
const app = express();

// Set security HTTP headers
app.use(helmet());

// Logger middleware
app.use(logger);

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Cors Middleware
app.use(cors(corsOptions));

// Express Body Parser
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Handling Cookie
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);

app.use(compression());

// For Serving Static files
app.use("/", express.static(path.join(__dirname, "public")));

// Our First Root Route
app.use("/", require("./routes/root"));
// Remaining App Route
app.use("/api/v1", routes);

// Handling 404 Route
app.all("*", (req, res, next) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    return next(
      new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
    );
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// Global Error Handler Middleware
app.use(ErrorHandler);

module.exports = app;
