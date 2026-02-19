import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import { userAPI, analyticsAPI, feedbackAPI } from '../services/api';

const MentorDashboard = () => {
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [feedbackForm, setFeedbackForm] = useState({
    message: '',
    category: 'general'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('Fetching mentor dashboard data...');
      const [studentsRes, analyticsRes, feedbackRes] = await Promise.all([
        userAPI.getAssignedStudents(),
        analyticsAPI.getMentorAnalytics(),
        feedbackAPI.getMentorFeedback()
      ]);

      console.log('Students received:', studentsRes.data);
      setStudents(studentsRes.data);
      setAnalytics(analyticsRes.data);
      setFeedback(feedbackRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('⚠️ Error loading data. Please refresh the page.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await feedbackAPI.createFeedback({
        student: selectedStudent._id,
        message: feedbackForm.message,
        category: feedbackForm.category
      });
      
      await fetchData();
      setShowFeedbackModal(false);
      setFeedbackForm({ message: '', category: 'general' });
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error creating feedback:', error);
    }
  };

  const openFeedbackModal = (student) => {
    setSelectedStudent(student);
    setShowFeedbackModal(true);
  };

  if (loading) return <Loading message="Loading mentor dashboard..." />;

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 style={{ marginBottom: '30px', color: '#374151' }}>Mentor Dashboard</h1>

        {/* Analytics Section */}
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>Analytics Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{analytics?.totalStudents || 0}</div>
              <div className="stat-label">Assigned Students</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{analytics?.avgCGPA || 0}</div>
              <div className="stat-label">Average CGPA</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{Object.keys(analytics?.skillsDistribution || {}).length}</div>
              <div className="stat-label">Unique Skills</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{analytics?.feedbackCount || 0}</div>
              <div className="stat-label">Feedback Given</div>
            </div>
          </div>
        </div>

        {/* Skills Distribution */}
        {analytics?.skillsDistribution && Object.keys(analytics.skillsDistribution).length > 0 && (
          <div className="card">
            <h2 style={{ marginBottom: '20px' }}>Skills Distribution</h2>
            <div className="grid grid-3">
              {Object.entries(analytics.skillsDistribution).map(([skill, count]) => (
                <div key={skill} style={{ 
                  background: '#f3f4f6', 
                  padding: '16px', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{count}</div>
                  <div style={{ color: '#6b7280' }}>{skill}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assigned Students */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Assigned Students ({students.length})</h2>
            <button className="btn btn-secondary" onClick={fetchData}>
              🔄 Refresh
            </button>
          </div>
          {students.length > 0 ? (
            <div className="grid grid-2">
              {students.map((student) => (
                <div key={student._id} className="card" style={{ margin: 0 }}>
                  <h3>{student.name}</h3>
                  <p><strong>Email:</strong> {student.email}</p>
                  <p><strong>CGPA:</strong> {student.profile?.cgpa || 'Not set'}</p>
                  <p><strong>Branch:</strong> {student.profile?.branch || 'Not set'}</p>
                  <p><strong>Projects:</strong> {student.profile?.projects || 0}</p>
                  <p><strong>Skills:</strong> {student.profile?.skills?.join(', ') || 'Not set'}</p>
                  
                  {/* Progress Section */}
                  <div style={{ marginTop: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '6px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Progress</h4>
                    <p><strong>Problems Solved:</strong> {student.progress?.problemsSolved || 0}</p>
                    <p><strong>Hours Practiced:</strong> {student.progress?.hoursPracticed || 0}</p>
                    <p><strong>Mock Interviews:</strong> {student.progress?.mockInterviews || 0}</p>
                    <p><strong>Certifications:</strong> {student.progress?.certifications?.length || 0}</p>
                  </div>
                  
                  <button 
                    className="btn btn-primary"
                    onClick={() => openFeedbackModal(student)}
                    style={{ marginTop: '12px' }}
                  >
                    Give Feedback
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h3 style={{ color: '#6b7280' }}>No students assigned yet</h3>
              <p style={{ color: '#9ca3af' }}>Contact your admin to assign students to you.</p>
            </div>
          )}
        </div>

        {/* Recent Feedback */}
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>Recent Feedback Given</h2>
          {feedback.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Category</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {feedback.slice(0, 10).map((fb) => (
                  <tr key={fb._id}>
                    <td>{fb.student?.name || 'Unknown'}</td>
                    <td>
                      <span style={{ 
                        background: '#3b82f6', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px' 
                      }}>
                        {fb.category}
                      </span>
                    </td>
                    <td>{fb.message.length > 50 ? fb.message.substring(0, 50) + '...' : fb.message}</td>
                    <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No feedback given yet.</p>
          )}
        </div>

        {/* Feedback Modal */}
        <Modal 
          isOpen={showFeedbackModal} 
          onClose={() => setShowFeedbackModal(false)} 
          title={`Give Feedback to ${selectedStudent?.name}`}
        >
          <form onSubmit={handleFeedbackSubmit}>
            <div className="form-group">
              <label>Category</label>
              <select
                className="form-control"
                value={feedbackForm.category}
                onChange={(e) => setFeedbackForm({...feedbackForm, category: e.target.value})}
                required
              >
                <option value="general">General</option>
                <option value="technical">Technical</option>
                <option value="interview">Interview</option>
                <option value="improvement">Improvement</option>
              </select>
            </div>
            <div className="form-group">
              <label>Feedback Message</label>
              <textarea
                className="form-control"
                rows="4"
                value={feedbackForm.message}
                onChange={(e) => setFeedbackForm({...feedbackForm, message: e.target.value})}
                placeholder="Provide constructive feedback to help the student improve..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Send Feedback</button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default MentorDashboard;