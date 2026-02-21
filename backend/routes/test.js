const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date() });
});

// Check database
router.get('/db-check', async (req, res) => {
  try {
    const allUsers = await User.find().select('name email role');
    const userCount = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const mentors = await User.countDocuments({ role: 'mentor' });
    const admins = await User.countDocuments({ role: 'admin' });
    
    res.json({
      totalUsers: userCount,
      students,
      mentors,
      admins,
      allUsers: allUsers,
      message: 'Database connected successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

module.exports = router;