module.exports = validateArray = (options) =>
  Array.isArray(options) ? options : options.split(",");
