const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/appError.util");

// Checks if user is authenticated or not
exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next(new ErrorHandler("Vui lòng đăng nhập", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    next(err);
  }
};

// Handling users roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorHandler(
            `(${req.user.role}) không có quyền truy cập tài nguyên này`,
            403
          )
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
