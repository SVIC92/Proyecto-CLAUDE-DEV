class ApiError extends Error {
  constructor(statusCode, message, field = null) {
    super(message);
    this.statusCode = statusCode;
    this.field = field;
  }
}

module.exports = ApiError;
