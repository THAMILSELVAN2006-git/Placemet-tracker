require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seedData = require('./seedData');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const progressRoutes = require('./routes/progress');
const companyRoutes = require('./routes/companies');
const feedbackRoutes = require('./routes/feedback');
const analyticsRoutes = require('./routes/analytics');
const testRoutes = require('./routes/test');
const debugRoutes = require('./routes/debug');
const simpleRoutes = require('./routes/simple');

const app = express();

connectDB().then(() => {
  // Seed test data after DB connection
  seedData();
});

const allowedOrigins = [
  'https://placemet-tracker.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.options('*', cors()); // allow preflight requests for all routes

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/test', testRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/simple', simpleRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Placement Tracker API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;