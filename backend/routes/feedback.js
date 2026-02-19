const express = require('express');
const { createFeedback, getStudentFeedback, getMentorFeedback } = require('../controllers/feedbackController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, authorize('mentor'), createFeedback);
router.get('/student', auth, authorize('student'), getStudentFeedback);
router.get('/mentor', auth, authorize('mentor'), getMentorFeedback);

module.exports = router;