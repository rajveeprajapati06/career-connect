const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  getEmployerApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadResume } = require('../middleware/uploadMiddleware');

router.post(
  '/',
  protect,
  authorize('candidate'),
  uploadResume.single('resume'),
  applyForJob
);
router.get('/my', protect, authorize('candidate'), getMyApplications);
router.get('/employer', protect, authorize('employer'), getEmployerApplications);
router.get('/job/:jobId', protect, authorize('employer'), getJobApplications);
router.put('/:id/status', protect, authorize('employer'), updateApplicationStatus);

module.exports = router;
