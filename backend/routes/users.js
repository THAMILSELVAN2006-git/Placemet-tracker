const express = require('express');
const { getProfile, updateProfile, getAllUsers, deleteUser, getStudents, getAssignedStudents, assignStudentToMentor, getMentors } = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/all', auth, authorize('admin'), getAllUsers);
router.delete('/:id', auth, authorize('admin'), deleteUser);
router.get('/students', auth, getStudents);
router.get('/mentors', auth, getMentors);
router.get('/assigned-students', auth, authorize('mentor'), getAssignedStudents);
router.post('/assign-student', auth, authorize('admin'), assignStudentToMentor);

// Temporary test routes - remove in production
router.get('/test-students', getStudents);
router.get('/test-mentors', getMentors);

// Debug route to check mentor assignments
router.get('/debug-mentor/:mentorId', async (req, res) => {
  try {
    const mentor = await User.findById(req.params.mentorId)
      .populate('profile.assignedStudents', 'name email')
      .select('-password');
    res.json({
      mentor: mentor,
      assignedStudents: mentor?.profile?.assignedStudents || []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;