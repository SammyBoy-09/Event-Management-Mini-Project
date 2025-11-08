const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

/**
 * Generate JWT Token
 * @param {string} id - User ID
 * @param {string} type - User type ('student' or 'admin')
 * @returns {string} JWT token
 */
const generateToken = (id, type = 'student') => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
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
          department: student.department,
          role: student.role
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
          department: student.department,
          role: student.role
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
 * @desc    Get user profile (student or admin)
 * @access  Private (requires JWT token)
 */
exports.getProfile = async (req, res) => {
  try {
    // Check if user is admin based on role
    const isAdmin = req.user.role === 'admin' || req.user.role === 'cr' || req.user.role === 'CR';
    
    if (isAdmin) {
      // Return admin profile
      const admin = await Admin.findById(req.user.id)
        .select('-password')
        .populate('approvedEvents', 'title date time location category');

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          student: { // Keep 'student' key for frontend compatibility
            id: admin._id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            department: admin.department,
            role: admin.role,
            permissions: admin.permissions,
            approvedEvents: admin.approvedEvents,
            createdAt: admin.createdAt,
            isAdmin: true
          }
        }
      });
    } else {
      // Return student profile
      const student = await Student.findById(req.user.id)
        .select('-password')
        .populate('registeredEvents', 'title date time location category');

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      return res.status(200).json({
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
            createdAt: student.createdAt,
            isAdmin: false
          }
        }
      });
    }

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
 * @desc    Update user profile (student or admin)
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    // Check if user is admin based on role
    const isAdmin = req.user.role === 'admin' || req.user.role === 'cr' || req.user.role === 'CR';
    
    if (isAdmin) {
      // Update admin profile
      const admin = await Admin.findById(req.user.id);

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      // Fields that can be updated for admin
      const allowedUpdates = ['name', 'phone'];
      
      allowedUpdates.forEach(field => {
        if (req.body[field]) {
          admin[field] = req.body[field];
        }
      });

      await admin.save();

      return res.status(200).json({
        success: true,
        message: 'Admin profile updated successfully',
        data: {
          student: { // Keep 'student' key for frontend compatibility
            id: admin._id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            department: admin.department,
            role: admin.role,
            isAdmin: true
          }
        }
      });
    } else {
      // Update student profile
      const student = await Student.findById(req.user.id);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Fields that can be updated for student
      const allowedUpdates = ['name', 'phone', 'year', 'semester'];
      
      allowedUpdates.forEach(field => {
        if (req.body[field]) {
          student[field] = req.body[field];
        }
      });

      await student.save();

      return res.status(200).json({
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
            role: student.role,
            isAdmin: false
          }
        }
      });
    }

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
 * @desc    Change password (student or admin)
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

    // Check if user is admin
    const isAdmin = req.user.role === 'admin' || req.user.role === 'cr' || req.user.role === 'CR';
    
    let user;
    if (isAdmin) {
      user = await Admin.findById(req.user.id);
    } else {
      user = await Student.findById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

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

/**
 * @route   POST /api/auth/admin/register
 * @desc    Register a new admin
 * @access  Public (for now - can be restricted later)
 */
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, department, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      department,
      role: role || 'admin' // Default to 'admin' if not specified
    });

    // Generate token
    const token = generateToken(admin._id, 'admin');

    res.status(201).json({
      success: true,
      message: 'Admin registration successful',
      data: {
        token,
        student: { // Using 'student' key for frontend compatibility
          id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          department: admin.department,
          role: admin.role,
          permissions: admin.permissions
        }
      }
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/auth/admin/login
 * @desc    Login admin
 * @access  Public
 */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id, 'admin');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        student: { // Using 'student' key for frontend compatibility
          id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          department: admin.department,
          role: admin.role,
          permissions: admin.permissions,
          lastLogin: admin.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/auth/admin/profile
 * @desc    Get admin profile
 * @access  Private (requires JWT token)
 */
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id)
      .select('-password')
      .populate('approvedEvents', 'title date time location category');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          department: admin.department,
          role: admin.role,
          permissions: admin.permissions,
          approvedEvents: admin.approvedEvents,
          lastLogin: admin.lastLogin,
          createdAt: admin.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
      error: error.message
    });
  }
};
