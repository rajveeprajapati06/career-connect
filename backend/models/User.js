const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['candidate', 'employer'],
      required: [true, 'Please select a role'],
    },
    phone: {
      type: String,
      default: '',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    // Candidate Profile Fields
    resume: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: '',
    },
    experience: {
      type: String,
      default: '',
    },
    education: {
      type: String,
      default: '',
    },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
    // Employer Profile Fields
    companyName: {
      type: String,
      default: '',
    },
    companyLogo: {
      type: String,
      default: '',
    },
    companyWebsite: {
      type: String,
      default: '',
    },
    companyDescription: {
      type: String,
      default: '',
    },
    companySize: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
