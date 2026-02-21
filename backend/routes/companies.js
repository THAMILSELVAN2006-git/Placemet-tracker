const express = require('express');
const { getAllCompanies, createCompany, updateCompany, deleteCompany, getEligibleCompanies } = require('../controllers/companyController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getAllCompanies);
router.post('/', auth, authorize('admin'), createCompany);
router.put('/:id', auth, authorize('admin'), updateCompany);
router.delete('/:id', auth, authorize('admin'), deleteCompany);
router.get('/eligible', auth, authorize('student'), getEligibleCompanies);

// Temporary test route - remove in production
router.get('/test-all', getAllCompanies);

module.exports = router;