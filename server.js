const http = require("http");
const dotenv = require("dotenv");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Configure .env
dotenv.config({ path: "./config.env" });

// Require App.js
const app = require("./app");
const connectDB = require("./config/dbConn");

// DB Connection
connectDB();

// Create an HTTP Server
const server = http.createServer(app);

// Get PORT from ENV or default
const runningEnvironment = process.env.NODE_ENV;
const PORT = process.env.PORT || 8000;

// Listening to Server
server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT} in ${runningEnvironment} mode`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
