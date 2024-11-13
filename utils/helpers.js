const axios = require("axios");

module.exports = validateArray = (options) =>
  Array.isArray(options) ? options : options.split(",");

// const getImageData = async (file) => {
//   // Image optimization
//   if (file) {
//     const imageBuffer = file.buffer; // stores the file in memory as a Buffer
//     const response = await axios.post(
//       process.env.TINYPNG_API_URL,
//       imageBuffer,
//       {
//         headers: {
//           "Content-Type": "application/octet-stream",
//           Authorization: `Basic ${Buffer.from(
//             `api:${process.env.TINYPNG_API_KEY}`
//           ).toString("base64")}`,
//         },
//       }
//     );

//     const optimizedImageUrl = response.data.output.url; // URL of optimized image
//     const imageSizeBefore = file.size;
//     const imageSizeAfter = response.data.output.size;

//     return { optimizedImageUrl, imageSizeBefore, imageSizeAfter };
//   }
//   return null;
// };

// module.exports = getImageData;
