const { createError } = require("./Error.js");
const jwt = require("jsonwebtoken");

const VerifyToken = async (req, res, next) => {
  const access_token = req?.cookies?.access_token;

  if (!access_token) {
    next(createError(401, "No Token Found. Please Sign In"));
  }

  try {
    jwt.verify(access_token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(createError(403, "Token is not valid"));
      }
      req.user = user;
      next();
    });
  } catch (error) {
    next(createError(error?.status, error?.message));
  }
};

module.exports = { VerifyToken };
