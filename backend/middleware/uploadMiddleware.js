const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist helper
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Create storage engines
const createStorage = (subfolder) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, '..', 'uploads', subfolder);
      ensureDirExists(uploadPath);
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });
};

// Resume Upload setup
const uploadResume = multer({
  storage: createStorage('resumes'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents (.doc, .docx) are allowed'));
    }
  },
});

// Image Upload setup (logos / profiles)
const fileFilterImage = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (.jpeg, .jpg, .png, .webp) are allowed'));
  }
};

const uploadCompanyLogo = multer({
  storage: createStorage('logos'),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: fileFilterImage,
});

const uploadProfilePicture = multer({
  storage: createStorage('profiles'),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: fileFilterImage,
});

module.exports = {
  uploadResume,
  uploadCompanyLogo,
  uploadProfilePicture,
};
