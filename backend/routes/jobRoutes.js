const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getFeaturedJobs,
  getEmployerStats,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.get('/featured', getFeaturedJobs);
router.get('/stats', protect, authorize('employer'), getEmployerStats);
router.get('/:id', getJob);
router.post('/', protect, authorize('employer'), createJob);
router.put('/:id', protect, authorize('employer'), updateJob);
router.delete('/:id', protect, authorize('employer'), deleteJob);

module.exports = router;
