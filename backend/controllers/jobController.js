const Job = require('../models/Job');
const Application = require('../models/Application');
const sendEmail = require('../utils/emailService');
const { jobPostedEmail } = require('../utils/emailTemplates');

// @desc    Get all jobs (with search, filter, pagination, sorting)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      search,
      category,
      type,
      location,
      salaryMin,
      salaryMax,
      employer,
    } = req.query;

    const query = {};
    if (employer) {
      query.employer = employer;
    } else {
      query.status = 'active';
    }

    // Search query implementation
    if (search) {
      // Use text index if search query is provided
      query.$text = { $search: search };
    }

    // Filters
    if (category) {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (salaryMin) {
      query.salaryMax = { $gte: Number(salaryMin) };
    }

    if (salaryMax) {
      query.salaryMin = { $lte: Number(salaryMax) };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with sorting
    let jobsQuery = Job.find(query);

    // If using text search and default sorting, we might want to sort by search relevance (textScore)
    if (search && sort === 'relevance') {
      jobsQuery = jobsQuery
        .select({ score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } });
    } else {
      jobsQuery = jobsQuery.sort(sort);
    }

    const totalJobs = await Job.countDocuments(query);
    const jobs = await jobsQuery.skip(skip).limit(limitNum).populate('employer', 'name email companyName companyLogo');

    const totalPages = Math.ceil(totalJobs / limitNum);

    res.status(200).json({
      success: true,
      count: jobs.length,
      pagination: {
        total: totalJobs,
        page: pageNum,
        pages: totalPages,
        hasMore: pageNum < totalPages,
      },
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'employer',
      'name email companyName companyLogo companyWebsite companyDescription companySize industry location'
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job listing not found',
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job posting
// @route   POST /api/jobs
// @access  Private (Employer)
const createJob = async (req, res, next) => {
  try {
    // Add employer ID and company name/logo details from active user session
    req.body.employer = req.user.id;
    req.body.company = req.user.companyName || 'Unknown Company';
    req.body.companyLogo = req.user.companyLogo || '';

    const job = await Job.create(req.body);

    // Send confirmation email to employer
    sendEmail({
      to: req.user.email,
      subject: 'Job Posting Published - CareerConnect',
      html: jobPostedEmail(req.user.name, job.title),
    });

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job listing
// @route   PUT /api/jobs/:id
// @access  Private (Employer Owner)
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job listing not found',
      });
    }

    // Verify user owns the job listing
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to update this job listing',
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job listing (and its applications)
// @route   DELETE /api/jobs/:id
// @access  Private (Employer Owner)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job listing not found',
      });
    }

    // Verify user owns the job listing
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to delete this job listing',
      });
    }

    // Cascade delete: Remove all applications associated with this job
    await Application.deleteMany({ job: req.params.id });

    // Remove the job itself
    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job posting and associated applications deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured jobs (latest 6 active)
// @route   GET /api/jobs/featured
// @access  Public
const getFeaturedJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: 'active' })
      .sort('-createdAt')
      .limit(6)
      .populate('employer', 'name email companyName companyLogo');

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get stats for employer dashboard
// @route   GET /api/jobs/stats
// @access  Private (Employer)
const getEmployerStats = async (req, res, next) => {
  try {
    const employerId = req.user.id;

    // Total jobs posted by this employer
    const totalJobs = await Job.countDocuments({ employer: employerId });

    // Active jobs
    const activeJobs = await Job.countDocuments({
      employer: employerId,
      status: 'active',
    });

    // Closed jobs
    const closedJobs = await Job.countDocuments({
      employer: employerId,
      status: 'closed',
    });

    // Fetch jobs to get total application sum
    const jobs = await Job.find({ employer: employerId });
    const jobIds = jobs.map((job) => job._id);

    // Sum applications count
    const totalApplicants = await Application.countDocuments({
      job: { $in: jobIds },
    });

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        activeJobs,
        closedJobs,
        totalApplicants,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getFeaturedJobs,
  getEmployerStats,
};
