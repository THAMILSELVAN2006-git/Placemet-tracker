const express = require('express');
const { getProgress, updateProgress, addCertification, deleteCertification } = require('../controllers/progressController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, authorize('student'), getProgress);
router.put('/', auth, authorize('student'), updateProgress);
router.post('/certifications', auth, authorize('student'), addCertification);
router.delete('/certifications/:certId', auth, authorize('student'), deleteCertification);

module.exports = router;