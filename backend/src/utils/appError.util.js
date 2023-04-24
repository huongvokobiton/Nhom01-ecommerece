class AppError extends Error {
  constructor(message, statusCode, status) {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    this.message = message;
  }
}

module.exports = AppError;
