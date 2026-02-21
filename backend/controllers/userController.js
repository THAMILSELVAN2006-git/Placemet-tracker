const User = require('../models/User');
const Progress = require('../models/Progress');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('profile.assignedMentor', 'name email')
      .select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { cgpa, branch, skills, projects } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'profile.cgpa': cgpa,
        'profile.branch': branch,
        'profile.skills': skills ? skills.split(',').map(s => s.trim()) : [],
        'profile.projects': projects
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate('profile.assignedMentor', 'name email')
      .populate('profile.assignedStudents', 'name email')
      .select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('-password');
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAssignedStudents = async (req, res) => {
  try {
    console.log('Getting assigned students for mentor:', req.user.id, req.user.name);
    
    // Get the currently logged-in mentor with fresh data
    const mentor = await User.findById(req.user.id)
      .populate({
        path: 'profile.assignedStudents',
        select: '-password',
        populate: {
          path: 'profile.assignedMentor',
          select: 'name email'
        }
      });
    
    console.log('Mentor found:', mentor?.name);
    console.log('Mentor profile:', mentor?.profile);
    console.log('Assigned students array:', mentor?.profile?.assignedStudents);
    
    if (!mentor || mentor.role !== 'mentor') {
      console.log('User is not a mentor or not found');
      return res.json([]);
    }
    
    // Ensure assignedStudents exists
    if (!mentor.profile) {
      mentor.profile = { assignedStudents: [] };
      await mentor.save();
    }
    
    if (!mentor.profile.assignedStudents) {
      mentor.profile.assignedStudents = [];
      await mentor.save();
    }
    
    const students = mentor.profile.assignedStudents || [];
    console.log('Students count:', students.length);
    console.log('Students to return:', students.map(s => s?.name || 'Unknown'));
    
    // Get progress data for each student
    const studentsWithProgress = await Promise.all(
      students.map(async (student) => {
        if (!student || !student._id) return null;
        const progress = await Progress.findOne({ student: student._id });
        return {
          ...student.toObject(),
          progress: progress || {
            problemsSolved: 0,
            hoursPracticed: 0,
            mockInterviews: 0,
            certifications: []
          }
        };
      })
    );
    
    const validStudents = studentsWithProgress.filter(s => s !== null);
    console.log('Returning students count:', validStudents.length);
    res.json(validStudents);
  } catch (error) {
    console.error('Error in getAssignedStudents:', error);
    res.status(500).json({ message: error.message });
  }
};

const assignStudentToMentor = async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;
    console.log('Assigning student:', studentId, 'to mentor:', mentorId);
    
    const student = await User.findById(studentId);
    const mentor = await User.findById(mentorId);
    
    if (!student || !mentor) {
      return res.status(404).json({ message: 'Student or mentor not found' });
    }
    
    if (student.role !== 'student' || mentor.role !== 'mentor') {
      return res.status(400).json({ message: 'Invalid user roles' });
    }
    
    // Remove student from ALL mentors first
    await User.updateMany(
      { role: 'mentor' },
      { $pull: { 'profile.assignedStudents': studentId } }
    );
    
    // Assign student to new mentor
    await User.findByIdAndUpdate(
      mentorId,
      { $addToSet: { 'profile.assignedStudents': studentId } }
    );
    
    // Update student's assigned mentor
    await User.findByIdAndUpdate(
      studentId,
      { 'profile.assignedMentor': mentorId }
    );
    
    console.log('Assignment completed successfully');
    res.json({ message: 'Student assigned successfully' });
  } catch (error) {
    console.error('Error in assignStudentToMentor:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getProfile, 
  updateProfile, 
  getAllUsers, 
  deleteUser, 
  getStudents, 
  getMentors, 
  getAssignedStudents, 
  assignStudentToMentor 
};