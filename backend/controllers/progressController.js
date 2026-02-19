const Progress = require('../models/Progress');

const getProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ student: req.user.id });
    if (!progress) {
      progress = await Progress.create({ student: req.user.id });
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { problemsSolved, hoursPracticed, mockInterviews } = req.body;
    
    let progress = await Progress.findOne({ student: req.user.id });
    if (!progress) {
      progress = await Progress.create({ 
        student: req.user.id,
        problemsSolved,
        hoursPracticed,
        mockInterviews
      });
    } else {
      progress = await Progress.findOneAndUpdate(
        { student: req.user.id },
        { problemsSolved, hoursPracticed, mockInterviews },
        { new: true }
      );
    }
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addCertification = async (req, res) => {
  try {
    const { name, issuer, dateObtained } = req.body;
    
    let progress = await Progress.findOne({ student: req.user.id });
    if (!progress) {
      progress = await Progress.create({ student: req.user.id });
    }
    
    progress.certifications.push({ name, issuer, dateObtained });
    await progress.save();
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCertification = async (req, res) => {
  try {
    const certId = req.params.certId;
    
    const progress = await Progress.findOne({ student: req.user.id });
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    
    // Remove certification by index (simpler approach)
    const index = parseInt(certId);
    if (isNaN(index) || index < 0 || index >= progress.certifications.length) {
      return res.status(400).json({ message: 'Invalid certification index' });
    }
    
    progress.certifications.splice(index, 1);
    await progress.save();
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProgress, updateProgress, addCertification, deleteCertification };