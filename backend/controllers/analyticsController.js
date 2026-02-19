const User = require('../models/User');
const Company = require('../models/Company');
const Progress = require('../models/Progress');
const Feedback = require('../models/Feedback');

const getAdminAnalytics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    const totalCompanies = 0; // Will be fixed when companies are added
    const activeCompanies = 0;
    
    res.json({
      totalStudents,
      totalMentors,
      totalCompanies,
      activeCompanies
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMentorAnalytics = async (req, res) => {
  try {
    // Get the currently logged-in mentor
    const mentor = await User.findById(req.user.id)
      .populate('profile.assignedStudents', 'profile.cgpa profile.skills');
    
    if (!mentor || mentor.role !== 'mentor') {
      return res.json({
        totalStudents: 0,
        avgCGPA: 0,
        skillsDistribution: {},
        feedbackCount: 0
      });
    }
    
    const assignedStudents = mentor.profile?.assignedStudents || [];
    const totalStudents = assignedStudents.length;
    
    const avgCGPA = totalStudents > 0 
      ? assignedStudents.reduce((sum, student) => sum + (student.profile?.cgpa || 0), 0) / totalStudents 
      : 0;
    
    const skillsDistribution = {};
    assignedStudents.forEach(student => {
      if (student.profile?.skills) {
        student.profile.skills.forEach(skill => {
          skillsDistribution[skill] = (skillsDistribution[skill] || 0) + 1;
        });
      }
    });
    
    const feedbackCount = await Feedback.countDocuments({ mentor: req.user.id });
    
    res.json({
      totalStudents,
      avgCGPA: Math.round(avgCGPA * 100) / 100,
      skillsDistribution,
      feedbackCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminAnalytics, getMentorAnalytics };