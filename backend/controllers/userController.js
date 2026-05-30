const User = require('../models/User');
const Job = require('../models/Job');

// @desc    Get current user profile details
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'savedJobs',
      select: 'title company location type salaryMin salaryMax status createdAt',
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    let fieldsToUpdate = {};

    // List of general fields allowed to update
    const generalFields = ['name', 'phone', 'location', 'bio'];
    generalFields.forEach((field) => {
      if (req.body[field] !== undefined) fieldsToUpdate[field] = req.body[field];
    });

    // Candidate-specific updates
    if (req.user.role === 'candidate') {
      const candidateFields = ['experience', 'education'];
      candidateFields.forEach((field) => {
        if (req.body[field] !== undefined) fieldsToUpdate[field] = req.body[field];
      });

      // Handle skills array parsing
      if (req.body.skills) {
        let skillsArray = [];
        if (typeof req.body.skills === 'string') {
          // If skills come as comma-separated string
          skillsArray = req.body.skills.split(',').map((skill) => skill.trim());
        } else if (Array.isArray(req.body.skills)) {
          skillsArray = req.body.skills;
        }
        fieldsToUpdate.skills = skillsArray;
      }
    }

    // Employer-specific updates
    if (req.user.role === 'employer') {
      const employerFields = [
        'companyName',
        'companyWebsite',
        'companyDescription',
        'companySize',
        'industry',
      ];
      employerFields.forEach((field) => {
        if (req.body[field] !== undefined) fieldsToUpdate[field] = req.body[field];
      });
    }

    // Handle files if uploaded (profilePicture, companyLogo, or resume)
    if (req.file) {
      const relativePath = `/uploads/${req.file.fieldname === 'profilePicture' ? 'profiles' : req.file.fieldname === 'companyLogo' ? 'logos' : 'resumes'}/${req.file.filename}`;

      if (req.file.fieldname === 'profilePicture') {
        fieldsToUpdate.profilePicture = relativePath;
      } else if (req.file.fieldname === 'companyLogo') {
        fieldsToUpdate.companyLogo = relativePath;
        // Also update all jobs created by this employer to sync the company logo!
        await Job.updateMany({ employer: req.user.id }, { companyLogo: relativePath });
      } else if (req.file.fieldname === 'resume') {
        fieldsToUpdate.resume = relativePath;
      }
    }

    // If logo/pic comes in body directly (URL/path string)
    if (req.body.profilePicture) fieldsToUpdate.profilePicture = req.body.profilePicture;
    if (req.body.companyLogo) {
      fieldsToUpdate.companyLogo = req.body.companyLogo;
      await Job.updateMany({ employer: req.user.id }, { companyLogo: req.body.companyLogo });
    }
    if (req.body.resume) fieldsToUpdate.resume = req.body.resume;

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save a job listing
// @route   POST /api/users/save-job/:jobId
// @access  Private (Candidate)
const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job posting not found',
      });
    }

    // Add to savedJobs list if not already there
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { savedJobs: jobId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Job listing saved successfully',
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unsave/remove a job listing
// @route   DELETE /api/users/save-job/:jobId
// @access  Private (Candidate)
const unsaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { savedJobs: jobId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Job listing removed from saved jobs',
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of saved jobs
// @route   GET /api/users/saved-jobs
// @access  Private (Candidate)
const getSavedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'savedJobs',
      populate: {
        path: 'employer',
        select: 'companyName companyLogo location',
      },
    });

    res.status(200).json({
      success: true,
      data: user.savedJobs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  saveJob,
  unsaveJob,
  getSavedJobs,
};
