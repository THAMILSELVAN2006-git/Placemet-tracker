import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL //|| 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  validateToken: () => api.get('/users/profile'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  getAllUsers: () => api.get('/users/all'),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getStudents: () => api.get('/users/students'),
  getMentors: () => api.get('/users/mentors'),
  getAssignedStudents: () => api.get('/users/assigned-students'),
  assignStudentToMentor: (studentId, mentorId) => api.post('/users/assign-student', { studentId, mentorId }),
};

export const progressAPI = {
  getProgress: () => api.get('/progress'),
  updateProgress: (progressData) => api.put('/progress', progressData),
  addCertification: (certData) => api.post('/progress/certifications', certData),
  deleteCertification: (certId) => api.delete(`/progress/certifications/${certId}`),
};

export const companyAPI = {
  getAllCompanies: () => api.get('/companies'),
  createCompany: (companyData) => api.post('/companies', companyData),
  updateCompany: (id, companyData) => api.put(`/companies/${id}`, companyData),
  deleteCompany: (id) => api.delete(`/companies/${id}`),
  getEligibleCompanies: () => api.get('/companies/eligible'),
};

export const feedbackAPI = {
  createFeedback: (feedbackData) => api.post('/feedback', feedbackData),
  getStudentFeedback: () => api.get('/feedback/student'),
  getMentorFeedback: () => api.get('/feedback/mentor'),
};

export const analyticsAPI = {
  getAdminAnalytics: () => api.get('/analytics/admin'),
  getMentorAnalytics: () => api.get('/analytics/mentor'),
};

export default api;