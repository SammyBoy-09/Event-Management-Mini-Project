const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

/**
 * Generate JWT Token
 * @param {string} id - Student ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token expires in 30 days
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new student
 * @access  Public
 */
exports.registerStudent = async (req, res) => {
  try {
    const { name, usn, email, password, year, semester, phone, gender, department } = req.body;

    // Validate required fields
    if (!name || !usn || !email || !password || !year || !semester || !phone || !gender || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [{ email }, { usn }]
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: existingStudent.email === email 
          ? 'Email already registered' 
          : 'USN already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new student
    const student = await Student.create({
      name,
      usn: usn.toUpperCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      year,
      semester,
      phone,
      gender,
      department
    });

    // Generate token
    const token = generateToken(student._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        student: {
          id: student._id,
          name: student.name,
          usn: student.usn,
          email: student.email,
          year: student.year,
          semester: student.semester,
          phone: student.phone,
          gender: student.gender,
          department: student.department
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login student
 * @access  Public
 */
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find student by email
    const student = await Student.findOne({ email: email.toLowerCase() });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(student._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        student: {
          id: student._id,
          name: student.name,
          usn: student.usn,
          email: student.email,
          year: student.year,
          semester: student.semester,
          phone: student.phone,
          gender: student.gender,
          department: student.department
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Get student profile
 * @access  Private (requires JWT token)
 */
exports.getProfile = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    const student = await Student.findById(req.user.id)
      .select('-password')
      .populate('registeredEvents', 'title date time location category');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        student: {
          id: student._id,
          name: student.name,
          usn: student.usn,
          email: student.email,
          year: student.year,
          semester: student.semester,
          phone: student.phone,
          gender: student.gender,
          department: student.department,
          role: student.role,
          registeredEvents: student.registeredEvents,
          createdAt: student.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Update student profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Fields that can be updated
    const allowedUpdates = ['name', 'phone', 'year', 'semester'];
    
    allowedUpdates.forEach(field => {
      if (req.body[field]) {
        student[field] = req.body[field];
      }
    });

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        student: {
          id: student._id,
          name: student.name,
          usn: student.usn,
          email: student.email,
          year: student.year,
          semester: student.semester,
          phone: student.phone,
          gender: student.gender,
          department: student.department,
          role: student.role
        }
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change password
 * @access  Private
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check current password
    const isPasswordValid = await bcrypt.compare(currentPassword, student.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(newPassword, salt);
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};
