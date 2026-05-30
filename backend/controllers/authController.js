const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');
const { welcomeEmail } = require('../utils/emailTemplates');

// Generate JWT Token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if all fields exist
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'Please enter all required fields (name, email, password, role)',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'A user with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      // Send Welcome Email (async, but don't await to avoid blocking registration response)
      sendEmail({
        to: user.email,
        subject: 'Welcome to CareerConnect!',
        html: welcomeEmail(user.name),
      });

      // Exclude password from the returned object
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        profilePicture: user.profilePicture || '',
        location: user.location || '',
        resume: user.resume || '',
        skills: user.skills || [],
        bio: user.bio || '',
        experience: user.experience || '',
        education: user.education || '',
        savedJobs: user.savedJobs || [],
        companyName: user.companyName || '',
        companyLogo: user.companyLogo || '',
        companyWebsite: user.companyWebsite || '',
        companyDescription: user.companyDescription || '',
        companySize: user.companySize || '',
        industry: user.industry || '',
        createdAt: user.createdAt,
      };

      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: userResponse,
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid user data provided',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    // Check for user (explicitly selecting password)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Build return user profile representation (excluding password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      profilePicture: user.profilePicture || '',
      location: user.location || '',
      resume: user.resume || '',
      skills: user.skills || [],
      bio: user.bio || '',
      experience: user.experience || '',
      education: user.education || '',
      savedJobs: user.savedJobs || [],
      companyName: user.companyName || '',
      companyLogo: user.companyLogo || '',
      companyWebsite: user.companyWebsite || '',
      companyDescription: user.companyDescription || '',
      companySize: user.companySize || '',
      industry: user.industry || '',
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    // req.user is already fetched in protect middleware
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out (clearing frontend state)
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};
