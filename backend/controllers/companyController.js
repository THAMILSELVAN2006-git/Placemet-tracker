const Company = require('../models/Company');
const User = require('../models/User');

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCompany = async (req, res) => {
  try {
    const { name, ctc, location, minCGPA, requiredSkills, description, isActive } = req.body;
    
    const company = await Company.create({
      name,
      ctc: parseFloat(ctc),
      location,
      minCGPA: parseFloat(minCGPA),
      requiredSkills: requiredSkills ? (typeof requiredSkills === 'string' ? requiredSkills.split(',').map(s => s.trim()).filter(s => s) : requiredSkills) : [],
      description,
      isActive: isActive !== undefined ? isActive : true
    });
    
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { name, ctc, location, minCGPA, requiredSkills, description, isActive } = req.body;
    
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      {
        name,
        ctc: parseFloat(ctc),
        location,
        minCGPA: parseFloat(minCGPA),
        requiredSkills: requiredSkills ? (typeof requiredSkills === 'string' ? requiredSkills.split(',').map(s => s.trim()).filter(s => s) : requiredSkills) : [],
        description,
        isActive
      },
      { new: true }
    );
    
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCompany = async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEligibleCompanies = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { cgpa, skills } = user.profile;
    
    const companies = await Company.find({
      isActive: true,
      minCGPA: { $lte: cgpa || 0 }
    });
    
    const eligibleCompanies = companies.filter(company => {
      if (!skills || skills.length === 0) return false;
      return company.requiredSkills.some(skill => 
        skills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
    });
    
    res.json(eligibleCompanies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllCompanies, createCompany, updateCompany, deleteCompany, getEligibleCompanies };