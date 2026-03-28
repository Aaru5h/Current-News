const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * JWT authentication middleware.
 * Verifies the Bearer token from the Authorization header and attaches
 * the decoded payload (including userId) to req.user.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        details: 'Missing or malformed Authorization header. Expected: Bearer <token>',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        details: 'Token is missing',
      });
    }

    if (!JWT_SECRET) {
      console.error('[AUTH] JWT_SECRET is not configured in environment variables');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error',
        details: 'Authentication is not properly configured',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        details: 'Your session has expired. Please log in again.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        details: 'The provided token is invalid',
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      details: error.message,
    });
  }
};

/**
 * Middleware to extract userId from JWT token and set it on req.params.
 * Use this on routes that need userId from token instead of URL params.
 * Falls back to req.params.userId if present (for backward compatibility).
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const extractUserId = (req, res, next) => {
  // If userId already in params (from URL), keep it
  if (req.params.userId) {
    return next();
  }

  // Otherwise extract from JWT
  if (req.user && req.user.userId) {
    req.params.userId = req.user.userId;
    return next();
  }

  return res.status(400).json({
    success: false,
    error: 'User ID required',
    details: 'userId must be provided in the URL or JWT token',
  });
};

module.exports = {
  authenticate,
  extractUserId,
};
