# Troubleshooting Guide - Placement Tracker

## Issues Fixed

### 1. Empty Admin Page Issue
**Problem:** Admin dashboard was showing empty/blank page
**Root Cause:** 
- Field name mismatch between frontend and backend (package vs ctc)
- Data type mismatch (string vs number for CTC)
- Complex API fetching logic causing failures

**Solution Applied:**
- Updated AdminDashboard to use `ctc` field instead of `package`
- Changed CTC input to number type
- Simplified data fetching logic
- Added proper error handling with fallback mock data

### 2. Company Management Visuals
**Added Features:**
- Company table with all company details
- Add/Edit/Delete company functionality
- Modal form for company management
- Visual badges for CGPA and CTC
- Empty state with call-to-action

## Testing Steps

### 1. Test Backend Connection
Open browser and visit:
```
http://localhost:5000/api/test/test
```
Should return: `{"message": "Backend is working!", "timestamp": "..."}`

### 2. Test Database
```
http://localhost:5000/api/test/db-check
```
Should show all users and counts

### 3. Test Companies API
```
http://localhost:5000/api/companies
```
Should return array of companies

### 4. Test Simple Routes
```
http://localhost:5000/api/simple/students
http://localhost:5000/api/simple/mentors
http://localhost:5000/api/simple/analytics
```

## Default Test Credentials

### Admin
- Email: admin@test.com
- Password: 123456

### Mentor
- Email: mentor@test.com
- Password: 123456

### Student
- Email: student1@test.com
- Password: 123456

## Running the Application

### Backend
```bash
cd backend
npm install
node server.js
```
Should see:
```
Server running on port 5000
MongoDB Connected: localhost
Data already exists, skipping seed
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Should see:
```
VITE v... ready in ...ms
Local: http://localhost:5173/
```

## Common Issues & Solutions

### Issue: "Cannot connect to server"
**Solution:** 
1. Make sure backend is running on port 5000
2. Check MongoDB is running
3. Verify CORS is enabled in server.js

### Issue: "Empty page after login"
**Solution:**
1. Check browser console for errors
2. Verify user role is correct
3. Clear localStorage and login again

### Issue: "Companies not showing"
**Solution:**
1. Check if companies exist in database
2. Visit http://localhost:5000/api/companies
3. If empty, add companies through admin dashboard

### Issue: "Authentication errors"
**Solution:**
1. Clear browser localStorage
2. Re-login with correct credentials
3. Check JWT_SECRET in .env file

## Database Schema

### Company Model
```javascript
{
  name: String (required),
  ctc: Number (required) - in LPA,
  location: String (required),
  minCGPA: Number (required, 0-10),
  requiredSkills: [String],
  description: String,
  isActive: Boolean (default: true)
}
```

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  role: String (enum: ['student', 'mentor', 'admin']),
  profile: {
    cgpa: Number,
    branch: String,
    skills: [String],
    projects: Number,
    assignedMentor: ObjectId,
    assignedStudents: [ObjectId]
  }
}
```

## API Endpoints

### Companies
- GET /api/companies - Get all companies
- POST /api/companies - Create company (Admin only)
- PUT /api/companies/:id - Update company (Admin only)
- DELETE /api/companies/:id - Delete company (Admin only)

### Simple Routes (No Auth)
- GET /api/simple/students - Get all students
- GET /api/simple/mentors - Get all mentors
- GET /api/simple/analytics - Get analytics data

### Test Routes
- GET /api/test/test - Test backend
- GET /api/test/db-check - Check database connection

## Next Steps

1. Login as admin (admin@test.com / 123456)
2. Navigate to dashboard
3. You should see:
   - System Analytics cards
   - Student Management table
   - Mentor Management table
   - Company Management table with Add button
4. Click "Add Company" to add new companies
5. Edit or delete existing companies

## Files Modified

1. `frontend/src/pages/AdminDashboard.jsx` - Added company management section
2. `frontend/src/index.css` - Added btn-secondary class
3. Backend files - Already properly configured

## Support

If issues persist:
1. Check browser console (F12) for errors
2. Check backend terminal for errors
3. Verify MongoDB is running
4. Clear browser cache and localStorage
5. Restart both frontend and backend servers
