const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  saveJob,
  unsaveJob,
  getSavedJobs,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadProfilePicture } = require('../middleware/uploadMiddleware');

router.get('/profile', protect, getProfile);
router.put(
  '/profile',
  protect,
  uploadProfilePicture.single('profilePicture'),
  updateProfile
);
router.post('/save-job/:jobId', protect, authorize('candidate'), saveJob);
router.delete('/save-job/:jobId', protect, authorize('candidate'), unsaveJob);
router.get('/saved-jobs', protect, authorize('candidate'), getSavedJobs);

module.exports = router;
