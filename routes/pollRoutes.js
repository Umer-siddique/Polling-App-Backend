// routes/pollRoutes.js
const express = require("express");
const pollController = require("../controller/pollController");
const { authProtect } = require("../middleware/authProtect");
const multer = require("multer");

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); // The image will be available in req.file.buffer

/**
 * @swagger
 * tags:
 *   name: Polls
 *   description: API to manage polls.
 */

/**
 * @swagger
 * /polls:
 *   post:
 *     summary: Create a new poll with an image
 *     description: Creates a poll with a title, options, and an image upload.
 *     tags: [Polls]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the poll
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of options for the poll
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the poll
 *     responses:
 *       201:
 *         description: Poll created successfully
 *       400:
 *         description: Bad request
 */
router
  .route("/")
  .post(authProtect, upload.single("image"), pollController.createPoll) // Ensure authProtect runs first
  .get(pollController.fetchAllPolls);

/**
 * @swagger
 * /polls/{id}:
 *   get:
 *     summary: Fetch a single poll by ID
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Poll ID
 *     responses:
 *       200:
 *         description: Poll fetched successfully
 *       404:
 *         description: Poll not found
 *   patch:
 *     summary: Update a poll by ID
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Poll ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Poll updated successfully
 *       404:
 *         description: Poll not found
 *   delete:
 *     summary: Delete a poll by ID
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Poll ID
 *     responses:
 *       200:
 *         description: Poll deleted successfully
 *       404:
 *         description: Poll not found
 */
router
  .route("/:id")
  .get(pollController.fetchPoll)
  .patch(pollController.updatePoll)
  .delete(pollController.deletePoll);

module.exports = router;
