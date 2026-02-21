const express = require('express');
const { getAdminAnalytics, getMentorAnalytics } = require('../controllers/analyticsController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/admin', getAdminAnalytics);
router.get('/mentor', auth, authorize('mentor'), getMentorAnalytics);

// Temporary test route - remove in production
router.get('/test-admin', getAdminAnalytics);

module.exports = router;