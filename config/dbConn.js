const mongoose = require("mongoose");
const { logEvents } = require("../middleware/logger");

const MONGO_URI =
  process.env.NODE_ENV === "development"
    ? process.env.LOCAL_MONGO_URI
    : process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connected sucessfully!");
  } catch (err) {
    console.log("Db connection error💥", err);
    logEvents(
      `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
      "mongoErrLog.log"
    );
    process.exit(1);
  }
};

module.exports = connectDB;
