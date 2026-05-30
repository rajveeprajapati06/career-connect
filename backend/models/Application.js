const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    fullName: {
      type: String,
      required: [true, 'Please add your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add your email'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    coverLetter: {
      type: String,
      required: [true, 'Please add a cover letter'],
    },
    resume: {
      type: String,
      required: [true, 'Please upload a resume'],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: { createdAt: 'appliedAt', updatedAt: true },
  }
);

// Prevent duplicate applications by same candidate to same job
applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
