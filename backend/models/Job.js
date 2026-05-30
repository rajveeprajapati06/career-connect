const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
      trim: true,
    },
    salaryMin: {
      type: Number,
      default: 0,
    },
    salaryMax: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Internship', 'Remote', 'Contract'],
      required: [true, 'Please specify job type'],
    },
    category: {
      type: String,
      enum: [
        'Technology',
        'Marketing',
        'Design',
        'Finance',
        'Engineering',
        'Sales',
        'Healthcare',
        'Education',
        'Other',
      ],
      required: [true, 'Please select a category'],
    },
    description: {
      type: String,
      required: [true, 'Please add a job description'],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    applicationDeadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for search
jobSchema.index({
  title: 'text',
  company: 'text',
  location: 'text',
  skills: 'text',
});

module.exports = mongoose.model('Job', jobSchema);
