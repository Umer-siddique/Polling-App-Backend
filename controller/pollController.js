const AsyncHandler = require("../utils/AsyncHandler");
const AppError = require("../utils/AppError");
const Poll = require("../schemas/pollSchema");

exports.createPoll = AsyncHandler(async (req, res, next) => {
  const { title, options } = req.body;
  const user = req.user.id;

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
  });

  res.status(201).json({
    poll: newPoll,
    imageSize: { before: imageSizeBefore, after: imageSizeAfter },
  });
});
exports.fetchAllPolls = AsyncHandler(async (req, res, next) => {});
exports.fetchPoll = AsyncHandler(async (req, res, next) => {});
exports.updatePoll = AsyncHandler(async (req, res, next) => {});
exports.deletePoll = AsyncHandler(async (req, res, next) => {});
