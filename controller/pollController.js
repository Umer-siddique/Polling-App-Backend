const axios = require("axios");
const AsyncHandler = require("../utils/AsyncHandler");
const AppError = require("../utils/AppError");
const Poll = require("../schemas/pollSchema");

const validateArray = (options) =>
  Array.isArray(options) ? options : options.split(",");

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
    imageUrl: optimizedImageUrl,
    options,
    createdBy: user,
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
  const polls = await Poll.find();

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
  const options = validateArray(req.body.options);
  const updatedPoll = await Poll.findByIdAndUpdate(
    req.params.id,
    { ...req.body, options },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ status: "success", data: { poll: updatedPoll } });
});

exports.deletePoll = AsyncHandler(async (req, res, next) => {
  // Find and delete document
  await Poll.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({ status: "sucess", message: "Poll deleted successfully" });
});
