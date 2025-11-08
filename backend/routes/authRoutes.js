const express = require('express');
const router = express.Router();
const { 
  registerStudent, 
  loginStudent, 
  getProfile, 
  updateProfile, 
  changePassword,
  registerAdmin,
  loginAdmin,
  getAdminProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Authentication Routes
 */

// Student Routes
// @route   POST /api/auth/register
// @desc    Register a new student
// @access  Public
router.post('/register', registerStudent);

// @route   POST /api/auth/login
// @desc    Login student and get token
// @access  Public
router.post('/login', loginStudent);

// @route   GET /api/auth/profile
// @desc    Get logged in student profile
// @access  Private (requires valid JWT token)
router.get('/profile', protect, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update student profile
// @access  Private
router.put('/profile', protect, updateProfile);

// @route   PUT /api/auth/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', protect, changePassword);

// Admin Routes
// @route   POST /api/auth/admin/register
// @desc    Register a new admin
// @access  Public (can be restricted later)
router.post('/admin/register', registerAdmin);

// @route   POST /api/auth/admin/login
// @desc    Login admin and get token
// @access  Public
router.post('/admin/login', loginAdmin);

// @route   GET /api/auth/admin/profile
// @desc    Get logged in admin profile
// @access  Private (requires valid JWT token)
router.get('/admin/profile', protect, getAdminProfile);

module.exports = router;
