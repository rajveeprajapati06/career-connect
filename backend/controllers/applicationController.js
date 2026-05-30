const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');
const {
  applicationSubmittedEmail,
  applicationAcceptedEmail,
  applicationRejectedEmail,
} = require('../utils/emailTemplates');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Candidate)
const applyForJob = async (req, res, next) => {
  try {
    const { jobId, fullName, email, phone, coverLetter } = req.body;

    if (!jobId || !fullName || !email || !coverLetter) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields (jobId, fullName, email, coverLetter)',
      });
    }

    // Verify job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job posting not found',
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'This job posting has been closed',
      });
    }

    // Check for duplicate application
    const alreadyApplied = await Application.findOne({
      candidate: req.user.id,
      job: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        error: 'You have already applied for this job listing',
      });
    }

    // Check if resume was uploaded
    let resumePath = '';
    if (req.file) {
      // Store relative path for URL access or server serving
      resumePath = `/uploads/resumes/${req.file.filename}`;
    } else if (req.user.resume) {
      // Fallback to resume in candidate profile
      resumePath = req.user.resume;
    } else {
      return res.status(400).json({
        success: false,
        error: 'Please upload a resume or complete your profile resume first',
      });
    }

    // Create application
    const application = await Application.create({
      candidate: req.user.id,
      job: jobId,
      fullName,
      email,
      phone: phone || req.user.phone || '',
      coverLetter,
      resume: resumePath,
    });

    // Update applicant count in Job model
    job.applicationsCount += 1;
    await job.save();

    // Update candidate profile resume path if it wasn't set yet
    if (!req.user.resume) {
      await User.findByIdAndUpdate(req.user.id, { resume: resumePath });
    }

    // Send confirmation email to Candidate (async)
    sendEmail({
      to: email,
      subject: `Application Submitted - ${job.title}`,
      html: applicationSubmittedEmail(fullName, job.title, job.company),
    });

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's job application history
// @route   GET /api/applications/my
// @access  Private (Candidate)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({
      candidate: req.user.id,
    })
      .populate({
        path: 'job',
        select: 'title company location type salaryMin salaryMax status',
      })
      .sort('-appliedAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a specific job posting
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer Owner)
const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Check job ownership first
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job posting not found',
      });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to view applications for this job posting',
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate('candidate', 'name email phone profilePicture skills experience education')
      .sort('-appliedAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications across all jobs for an employer
// @route   GET /api/applications/employer
// @access  Private (Employer)
const getEmployerApplications = async (req, res, next) => {
  try {
    // Find all jobs created by this employer
    const jobs = await Job.find({ employer: req.user.id });
    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title company location status')
      .populate('candidate', 'name email phone profilePicture skills bio')
      .sort('-appliedAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Accept/Reject)
// @route   PUT /api/applications/:id/status
// @access  Private (Employer Owner)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid application status (reviewed, accepted, rejected)',
      });
    }

    let application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found',
      });
    }

    // Verify job belongs to active employer session
    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to update this application status',
      });
    }

    // Update status
    application.status = status;
    await application.save();

    // Trigger emails for accepted/rejected status updates
    if (status === 'accepted') {
      sendEmail({
        to: application.email,
        subject: `Application Update: Accepted - ${application.job.title}`,
        html: applicationAcceptedEmail(
          application.fullName,
          application.job.title,
          application.job.company
        ),
      });
    } else if (status === 'rejected') {
      sendEmail({
        to: application.email,
        subject: `Application Update: ${application.job.title}`,
        html: applicationRejectedEmail(
          application.fullName,
          application.job.title,
          application.job.company
        ),
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  getEmployerApplications,
  updateApplicationStatus,
};
