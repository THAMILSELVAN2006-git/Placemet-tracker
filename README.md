# Placement Preparation Tracker for Colleges

A complete Full Stack MERN application for tracking student placement preparation with role-based dashboards for Students, Mentors, and Admins.

## 🚀 Features

### Student Features
- ✅ Register & Login with JWT authentication
- ✅ Complete profile management (CGPA, Branch, Skills, Projects)
- ✅ Track preparation progress (Problems solved, Hours practiced, Mock interviews)
- ✅ Manage certifications (Add/Delete)
- ✅ View eligible companies based on profile
- ✅ Receive mentor feedback

### Mentor Features
- ✅ View assigned students with detailed profiles
- ✅ Real-time analytics (Total students, Average CGPA, Skills distribution)
- ✅ Provide categorized feedback to students
- ✅ Track feedback history

### Admin Features
- ✅ System-wide analytics dashboard
- ✅ Complete company management (Add/Edit/Delete)
- ✅ User management with role-based access
- ✅ Dynamic data visualization

## 🛠️ Tech Stack

- **Frontend:** React.js (JSX), Vite, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** Custom CSS with responsive design

## 📁 Project Structure

```
Placement Tracker FSD/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/auth.js
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   ├── services/api.js
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your MongoDB connection:
```env
MONGODB_URI=mongodb://localhost:27017/placement_tracker
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

4. Start the backend server:
```bash
node server.js
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔐 Default Login Credentials

After setting up, you can register new users or create test accounts:

### Admin Account
- Register with role: "admin"
- Email: admin@example.com
- Password: admin123

### Mentor Account
- Register with role: "mentor"
- Email: mentor@example.com
- Password: mentor123

### Student Account
- Register with role: "student"
- Email: student@example.com
- Password: student123

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/all` - Get all users (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Progress
- `GET /api/progress` - Get student progress
- `PUT /api/progress` - Update progress
- `POST /api/progress/certifications` - Add certification
- `DELETE /api/progress/certifications/:id` - Delete certification

### Companies
- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create company (Admin only)
- `PUT /api/companies/:id` - Update company (Admin only)
- `DELETE /api/companies/:id` - Delete company (Admin only)
- `GET /api/companies/eligible` - Get eligible companies (Student)

### Feedback
- `POST /api/feedback` - Create feedback (Mentor only)
- `GET /api/feedback/student` - Get student feedback
- `GET /api/feedback/mentor` - Get mentor feedback

### Analytics
- `GET /api/analytics/admin` - Admin analytics
- `GET /api/analytics/mentor` - Mentor analytics

## 🎯 Key Features Implemented

1. **Fully Dynamic Data** - No hardcoded values, all data from MongoDB
2. **Role-Based Access Control** - Different dashboards for each role
3. **Real-Time Updates** - Immediate reflection of changes
4. **Responsive Design** - Works on all device sizes
5. **Professional UI** - Clean, modern interface
6. **Error Handling** - Comprehensive error management
7. **Loading States** - Smooth user experience
8. **Form Validation** - Client and server-side validation

## 🔧 Development Commands

### Backend
```bash
# Start server
node server.js

# Development with auto-restart
npm run dev
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Ensure MongoDB connection string is correct
3. Deploy using platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to platforms like Netlify, Vercel, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@placementtracker.com or create an issue in the repository.

---

**Built with ❤️ using MERN Stack**