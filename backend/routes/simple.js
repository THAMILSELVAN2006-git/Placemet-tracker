const express = require('express');
const { getStudentsSimple, getMentorsSimple, getAnalyticsSimple, assignStudentSimple } = require('../controllers/simpleController');

const router = express.Router();

// Simple routes without authentication
router.get('/students', getStudentsSimple);
router.get('/mentors', getMentorsSimple);
router.get('/analytics', getAnalyticsSimple);
router.post('/assign', assignStudentSimple);

module.exports = router;