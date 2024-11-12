// routes/pollRoutes.js
const express = require("express");
const pollController = require("../controller/pollController");
const { authProtect } = require("../middleware/authProtect");
const multer = require("multer");
const Poll = require("../schemas/pollSchema");
const ValidateResourceExist = require("../middleware/ValidateResource");

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
 *   get:
 *     summary: Retrieve a list of all polls
 *     description: Fetches all polls in the database.
 *     tags: [Polls]
 *     responses:
 *       200:
 *         description: A list of polls
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Poll ID
 *                   title:
 *                     type: string
 *                     description: Title of the poll
 *                   imageUrl:
 *                     type: string
 *                     description: URL of the poll image
 *                   originalImageSize:
 *                     type: string
 *                     description: Image size before optimization
 *                   optimizedImageSize:
 *                     type: string
 *                     description: Image size after optimization
 *                   options:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Array of poll options
 *                   votes:
 *                     type: array
 *                     items:
 *                       type: number
 *                     description: Array of votes for each option
 *                   createdBy:
 *                     type: string
 *                     description: ID of the user who created the poll
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
  .get(ValidateResourceExist(Poll), pollController.fetchPoll)
  .patch(ValidateResourceExist(Poll), authProtect, pollController.updatePoll)
  .delete(ValidateResourceExist(Poll), authProtect, pollController.deletePoll);

module.exports = router;
