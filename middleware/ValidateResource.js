const AppError = require("../utils/AppError");
const AsyncHandler = require("../utils/AsyncHandler");

const ValidateResourceExists = (Model) => {
  return AsyncHandler(async (req, res, next) => {
    const doc = await Model.findById(req.params.id).populate(
      "createdBy",
      "username email"
    );

    if (!doc) {
      return next(new AppError("Document Not Found!", 404));
    }

    // If found, attach document to request for downstream middleware or route handler
    req.document = doc;

    next();
  });
};

module.exports = ValidateResourceExists;
