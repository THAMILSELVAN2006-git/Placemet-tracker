const User = require('../models/User');

// Simple endpoints that work without authentication
const getStudentsSimple = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('name email role');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMentorsSimple = async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('name email role');
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnalyticsSimple = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    
    res.json({
      totalStudents,
      totalMentors,
      totalCompanies: 0,
      activeCompanies: 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignStudentSimple = async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;
    
    // Update mentor with assigned student
    await User.findByIdAndUpdate(
      mentorId,
      { $addToSet: { 'profile.assignedStudents': studentId } }
    );
    
    // Update student with assigned mentor
    await User.findByIdAndUpdate(
      studentId,
      { 'profile.assignedMentor': mentorId }
    );
    
    res.json({ message: 'Student assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudentsSimple,
  getMentorsSimple,
  getAnalyticsSimple,
  assignStudentSimple
};