const router = require("express").Router();
const pollController = require("../controller/pollController");
const { authProtect } = require("../middleware/authProtect");
const multer = require("multer");

// Configured multer to use memory storage (for uploading images into memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); // The image will be available in req.file.buffer

router
  .route("/")
  .post(upload.single("image"), authProtect, pollController.createPoll)
  .get(pollController.fetchAllPolls);

router
  .route("/:id")
  .get(pollController.fetchPoll)
  .patch(pollController.updatePoll)
  .delete(pollController.deletePoll);

module.exports = router;
