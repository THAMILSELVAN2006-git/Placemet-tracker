const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Simple test endpoint to see all users
router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find().select('name email role');
    res.json({
      total: users.length,
      users: users,
      students: users.filter(u => u.role === 'student'),
      mentors: users.filter(u => u.role === 'mentor'),
      admins: users.filter(u => u.role === 'admin')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;