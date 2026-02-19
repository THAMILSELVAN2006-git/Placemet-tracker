const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  problemsSolved: {
    type: Number,
    default: 0
  },
  hoursPracticed: {
    type: Number,
    default: 0
  },
  mockInterviews: {
    type: Number,
    default: 0
  },
  certifications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    issuer: {
      type: String,
      required: true,
      trim: true
    },
    dateObtained: {
      type: Date,
      required: true
    }
  }]
}, {
  timestamps: true
});

progressSchema.index({ student: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);