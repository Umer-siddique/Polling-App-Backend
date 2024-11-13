const axios = require("axios");
const AsyncHandler = require("../utils/AsyncHandler");
const AppError = require("../utils/AppError");
const Poll = require("../schemas/pollSchema");
const validateArray = require("../utils/helpers");
const { io } = require("../app");
const getImageData = require("../utils/helpers");

exports.createPoll = AsyncHandler(async (req, res, next) => {
  const { title } = req.body;
  const user = req.user.id;
  const options = validateArray(req.body.options);

  // Ensure image is available
  if (!req.file) {
    return next(new AppError("Image is required", 400));
  }

  // Image optimization
  const imageBuffer = req.file.buffer; // stores the file in memory as a Buffer
  const response = await axios.post(process.env.TINYPNG_API_URL, imageBuffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      Authorization: `Basic ${Buffer.from(
        `api:${process.env.TINYPNG_API_KEY}`
      ).toString("base64")}`,
    },
  });

  const optimizedImageUrl = response.data.output.url; // URL of optimized image
  const imageSizeBefore = req.file.size;
  const imageSizeAfter = response.data.output.size;

  const newPoll = await Poll.create({
    title,
    options,
    createdBy: user,
    imageUrl: optimizedImageUrl,
    originalImageSize: imageSizeBefore,
    optimizedImageSize: imageSizeAfter,
  });

  res.status(201).json({
    status: "success",
    data: {
      poll: newPoll,
    },
  });
});

exports.fetchAllPolls = AsyncHandler(async (req, res, next) => {
  const polls = await Poll.find().sort({ createdAt: -1 });

  if (!polls) {
    return next(new AppError("No Polls exist please create some!", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      polls,
    },
  });
});

exports.fetchPoll = AsyncHandler(async (req, res, next) => {
  // If found, `req.document` contains the document
  res.status(200).json({
    status: "success",
    data: {
      poll: req.document,
    },
  });
});

exports.updatePoll = AsyncHandler(async (req, res, next) => {
  // Find and update document
  // const options = validateArray(req.body.options);
  console.log("options", req.body.options);

  const updatedPoll = await Poll.updateOne({ _id: req.params.id }, req.body);
  res.status(200).json({ status: "success", data: { poll: updatedPoll } });
});

exports.deletePoll = AsyncHandler(async (req, res, next) => {
  // Find and delete document
  await Poll.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({ status: "sucess", message: "Poll deleted successfully" });
});

exports.voteOnPolls = AsyncHandler(async (req, res, next) => {
  const pollId = req.params.id;
  const { optionIndex } = req.body; // The index of the option being voted for

  console.log("Typechecking", typeof optionIndex);
  console.log("optionindex", optionIndex);

  // Validate the option index type
  if (typeof optionIndex !== "number") {
    return next(new AppError("Invalid option index.", 400));
  }

  const poll = await Poll.findById(pollId);

  if (!poll) {
    return next(new AppError("Poll not found!", 404));
  }

  // Validate the option index
  if (optionIndex < 0 || optionIndex >= poll.options.length) {
    return res.status(400).json({ error: "Option index out of bounds." });
  }

  // Increment the vote count for the selected option
  poll.votes[optionIndex] += 1;

  // Only update the votes field in the database
  await Poll.updateOne({ _id: pollId }, { votes: poll.votes });

  // io.emit("pollUpdated", poll);

  res.status(200).json({
    status: "success",
    data: {
      poll,
    },
  });
});
