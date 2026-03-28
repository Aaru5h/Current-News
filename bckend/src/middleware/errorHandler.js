/**
 * Centralized error handling middleware.
 * Catches all errors passed via next(error) and returns a standardized response.
 *
 * @param {Error} err - The error object
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: messages.join(', '),
    });
  }

  // Mongoose cast error (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
      details: `Value "${err.value}" is not a valid ${err.kind}`,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(', ');
    return res.status(409).json({
      success: false,
      error: 'Duplicate Entry',
      details: `A record with that ${field} already exists`,
    });
  }

  // Axios / external service error
  if (err.isAxiosError) {
    return res.status(502).json({
      success: false,
      error: 'External Service Error',
      details: err.response?.data?.detail || err.message,
    });
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

/**
 * 404 handler for unknown routes.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    details: `${req.method} ${req.originalUrl} does not exist`,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
