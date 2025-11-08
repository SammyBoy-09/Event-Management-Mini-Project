const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

/**
 * Protect routes - Verify JWT token
 * @desc Middleware to authenticate and authorize requests
 */
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check user type from token and fetch from appropriate collection
      let user;
      if (decoded.type === 'admin') {
        user = await Admin.findById(decoded.id).select('-password');
      } else {
        user = await Student.findById(decoded.id).select('-password');
      }

      req.user = user;
      req.student = user; // Also set req.student for consistency with existing code

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized - User not found'
        });
      }

      next(); // Continue to next middleware/route handler

    } catch (error) {
      console.error('Token verification error:', error);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired - Please login again'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Not authorized - Invalid token'
      });
    }
  }

  // No token provided
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized - No token provided'
    });
  }
};

module.exports = { protect };
