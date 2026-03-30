const AppError = require("../utils/AppError");

const validate = (schema, target = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return next(
        new AppError("Geçersiz istek verisi", 400, result.error.flatten())
      );
    }

    req[target] = result.data;
    next();
  };
};

module.exports = validate;
