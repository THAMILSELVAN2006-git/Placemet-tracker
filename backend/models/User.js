const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'mentor', 'admin'],
    required: true
  },
  profile: {
    cgpa: {
      type: Number,
      min: 0,
      max: 10
    },
    branch: {
      type: String,
      trim: true
    },
    skills: [{
      type: String,
      trim: true
    }],
    projects: {
      type: Number,
      default: 0
    },
    assignedStudents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    assignedMentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);