const ApiError = require('../utils/ApiError');

function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: { message: err.message, field: err.field },
    });
  }

  console.error(err);
  return res.status(500).json({
    error: { message: 'Error interno del servidor', field: null },
  });
}

module.exports = errorHandler;
