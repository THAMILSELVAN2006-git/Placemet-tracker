const User = require('./models/User');
const Company = require('./models/Company');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    // Check if data already exists
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Data already exists, skipping seed');
      return;
    }

    console.log('Seeding test data...');

    // Create test users
    const hashedPassword = await bcrypt.hash('123456', 12);

    const testUsers = [
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin'
      },
      {
        name: 'Test Mentor',
        email: 'mentor@test.com',
        password: hashedPassword,
        role: 'mentor'
      },
      {
        name: 'Test Student 1',
        email: 'student1@test.com',
        password: hashedPassword,
        role: 'student',
        profile: {
          cgpa: 8.5,
          branch: 'Computer Science',
          skills: ['JavaScript', 'React', 'Node.js'],
          projects: 3
        }
      },
      {
        name: 'Test Student 2',
        email: 'student2@test.com',
        password: hashedPassword,
        role: 'student',
        profile: {
          cgpa: 7.8,
          branch: 'Information Technology',
          skills: ['Python', 'Django', 'MySQL'],
          projects: 2
        }
      }
    ];

    await User.insertMany(testUsers);

    // Create test companies
    const testCompanies = [
      {
        name: 'Tech Corp',
        ctc: 12,
        location: 'Bangalore',
        minCGPA: 7.0,
        requiredSkills: ['JavaScript', 'React'],
        description: 'Leading tech company',
        isActive: true
      },
      {
        name: 'Software Solutions',
        ctc: 8,
        location: 'Pune',
        minCGPA: 6.5,
        requiredSkills: ['Python', 'Django'],
        description: 'Software development company',
        isActive: true
      }
    ];

    await Company.insertMany(testCompanies);

    console.log('Test data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;