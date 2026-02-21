const Feedback = require('../models/Feedback');

const createFeedback = async (req, res) => {
  try {
    const { student, message, category } = req.body;
    
    const feedback = await Feedback.create({
      mentor: req.user.id,
      student,
      message,
      category
    });
    
    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate('student', 'name email')
      .populate('mentor', 'name email');
    
    res.status(201).json(populatedFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ student: req.user.id })
      .populate('mentor', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMentorFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ mentor: req.user.id })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createFeedback, getStudentFeedback, getMentorFeedback };