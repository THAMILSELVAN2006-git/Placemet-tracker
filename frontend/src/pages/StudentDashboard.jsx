import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import { userAPI, progressAPI, companyAPI, feedbackAPI } from '../services/api';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  const [profileForm, setProfileForm] = useState({
    cgpa: '',
    branch: '',
    skills: '',
    projects: ''
  });

  const [progressForm, setProgressForm] = useState({
    problemsSolved: '',
    hoursPracticed: '',
    mockInterviews: ''
  });

  const [certForm, setCertForm] = useState({
    name: '',
    issuer: '',
    dateObtained: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, progressRes, companiesRes, feedbackRes] = await Promise.all([
        userAPI.getProfile(),
        progressAPI.getProgress(),
        companyAPI.getEligibleCompanies(),
        feedbackAPI.getStudentFeedback()
      ]);

      setProfile(profileRes.data);
      setProgress(progressRes.data);
      setCompanies(companiesRes.data);
      setFeedback(feedbackRes.data);

      setProfileForm({
        cgpa: profileRes.data.profile?.cgpa || '',
        branch: profileRes.data.profile?.branch || '',
        skills: profileRes.data.profile?.skills?.join(', ') || '',
        projects: profileRes.data.profile?.projects || ''
      });

      setProgressForm({
        problemsSolved: progressRes.data?.problemsSolved || '',
        hoursPracticed: progressRes.data?.hoursPracticed || '',
        mockInterviews: progressRes.data?.mockInterviews || ''
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    console.log('Updating profile:', profileForm);
    try {
      const response = await userAPI.updateProfile(profileForm);
      console.log('Profile updated:', response.data);
      setShowProfileModal(false);
      setSuccessMessage('✅ Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      await fetchData();
    } catch (error) {
      console.error('Profile update error:', error);
      setErrorMessage('❌ ' + (error.response?.data?.message || 'Error updating profile'));
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleProgressUpdate = async (e) => {
    e.preventDefault();
    console.log('Updating progress:', progressForm);
    try {
      const response = await progressAPI.updateProgress(progressForm);
      console.log('Progress updated:', response.data);
      setShowProgressModal(false);
      setSuccessMessage('✅ Progress updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      await fetchData();
    } catch (error) {
      console.error('Progress update error:', error);
      setErrorMessage('❌ ' + (error.response?.data?.message || 'Error updating progress'));
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleAddCertification = async (e) => {
    e.preventDefault();
    console.log('Adding certification:', certForm);
    try {
      const response = await progressAPI.addCertification(certForm);
      console.log('Certification added:', response.data);
      setShowCertModal(false);
      setCertForm({ name: '', issuer: '', dateObtained: '' });
      setSuccessMessage('✅ Certification added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      await fetchData();
    } catch (error) {
      console.error('Add certification error:', error);
      setErrorMessage('❌ ' + (error.response?.data?.message || 'Error adding certification'));
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleDeleteCertification = async (certId) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        await progressAPI.deleteCertification(certId);
        await fetchData();
        setSuccessMessage('Certification deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting certification:', error);
        setErrorMessage('Error deleting certification. Please try again.');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

  if (loading) return <Loading message="Loading your dashboard..." />;

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 style={{ marginBottom: '30px', color: '#374151' }}>Student Dashboard</h1>

        {successMessage && (
          <div style={{ 
            background: '#d1fae5', 
            color: '#065f46', 
            padding: '12px', 
            borderRadius: '6px', 
            marginBottom: '20px',
            border: '1px solid #10b981'
          }}>
            ✅ {successMessage}
          </div>
        )}

        {errorMessage && (
          <div style={{ 
            background: '#fee2e2', 
            color: '#991b1b', 
            padding: '12px', 
            borderRadius: '6px', 
            marginBottom: '20px',
            border: '1px solid #ef4444'
          }}>
            ❌ {errorMessage}
          </div>
        )}

        {/* Profile Section */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Profile Information</h2>
            <button className="btn btn-primary" onClick={() => setShowProfileModal(true)}>
              Edit Profile
            </button>
          </div>
          <div className="grid grid-2">
            <div>
              <p><strong>Name:</strong> {profile?.name}</p>
              <p><strong>Email:</strong> {profile?.email}</p>
              <p><strong>CGPA:</strong> {profile?.profile?.cgpa || 'Not set'}</p>
            </div>
            <div>
              <p><strong>Branch:</strong> {profile?.profile?.branch || 'Not set'}</p>
              <p><strong>Projects:</strong> {profile?.profile?.projects || 0}</p>
              <p><strong>Skills:</strong> {profile?.profile?.skills?.join(', ') || 'Not set'}</p>
            </div>
          </div>
          {profile?.profile?.assignedMentor && (
            <div style={{ marginTop: '15px', padding: '10px', background: '#e0f2fe', borderRadius: '6px' }}>
              <p><strong>Assigned Mentor:</strong> {profile.profile.assignedMentor.name} ({profile.profile.assignedMentor.email})</p>
            </div>
          )}
        </div>

        {/* Progress Overview */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Preparation Progress</h2>
            <button className="btn btn-primary" onClick={() => setShowProgressModal(true)}>
              Update Progress
            </button>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{progress?.problemsSolved || 0}</div>
              <div className="stat-label">Problems Solved</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{progress?.hoursPracticed || 0}</div>
              <div className="stat-label">Hours Practiced</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{progress?.mockInterviews || 0}</div>
              <div className="stat-label">Mock Interviews</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{progress?.certifications?.length || 0}</div>
              <div className="stat-label">Certifications</div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Certifications</h2>
            <button className="btn btn-success" onClick={() => setShowCertModal(true)}>
              Add Certification
            </button>
          </div>
          {progress?.certifications?.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Issuer</th>
                  <th>Date Obtained</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {progress.certifications.map((cert, index) => (
                  <tr key={index}>
                    <td>{cert.name}</td>
                    <td>{cert.issuer}</td>
                    <td>{new Date(cert.dateObtained).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteCertification(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No certifications added yet.</p>
          )}
        </div>

        {/* Eligible Companies */}
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>Eligible Companies</h2>
          {companies.length > 0 ? (
            <div className="grid grid-2">
              {companies.map((company) => (
                <div key={company._id} className="card" style={{ margin: 0 }}>
                  <h3>{company.name}</h3>
                  <p><strong>CTC:</strong> ₹{company.ctc} LPA</p>
                  <p><strong>Location:</strong> {company.location}</p>
                  <p><strong>Min CGPA:</strong> {company.minCGPA}</p>
                  <p><strong>Required Skills:</strong> {company.requiredSkills.join(', ')}</p>
                  {company.description && <p><strong>Description:</strong> {company.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h3 style={{ color: '#6b7280' }}>No eligible companies found</h3>
              <p style={{ color: '#9ca3af' }}>Update your profile with CGPA and skills to see opportunities.</p>
            </div>
          )}
        </div>

        {/* Feedback */}
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>Mentor Feedback</h2>
          {feedback.length > 0 ? (
            <div>
              {feedback.map((fb) => (
                <div key={fb._id} style={{ 
                  background: '#f9fafb', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  marginBottom: '16px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong>{fb.mentor?.name || 'Unknown Mentor'}</strong>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ margin: '8px 0' }}>{fb.message}</p>
                  <span style={{ 
                    background: '#3b82f6', 
                    color: 'white', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px' 
                  }}>
                    {fb.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>No feedback received yet.</p>
          )}
        </div>

        {/* Profile Modal */}
        <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} title="Edit Profile">
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label>CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                className="form-control"
                value={profileForm.cgpa}
                onChange={(e) => setProfileForm({...profileForm, cgpa: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Branch</label>
              <input
                type="text"
                className="form-control"
                value={profileForm.branch}
                onChange={(e) => setProfileForm({...profileForm, branch: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Skills (comma separated)</label>
              <input
                type="text"
                className="form-control"
                value={profileForm.skills}
                onChange={(e) => setProfileForm({...profileForm, skills: e.target.value})}
                placeholder="JavaScript, React, Node.js"
              />
            </div>
            <div className="form-group">
              <label>Number of Projects</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={profileForm.projects}
                onChange={(e) => setProfileForm({...profileForm, projects: e.target.value})}
              />
            </div>
            <button type="submit" className="btn btn-primary">Update Profile</button>
          </form>
        </Modal>

        {/* Progress Modal */}
        <Modal isOpen={showProgressModal} onClose={() => setShowProgressModal(false)} title="Update Progress">
          <form onSubmit={handleProgressUpdate}>
            <div className="form-group">
              <label>Problems Solved</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={progressForm.problemsSolved}
                onChange={(e) => setProgressForm({...progressForm, problemsSolved: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Hours Practiced</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={progressForm.hoursPracticed}
                onChange={(e) => setProgressForm({...progressForm, hoursPracticed: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Mock Interviews Attended</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={progressForm.mockInterviews}
                onChange={(e) => setProgressForm({...progressForm, mockInterviews: e.target.value})}
              />
            </div>
            <button type="submit" className="btn btn-primary">Update Progress</button>
          </form>
        </Modal>

        {/* Certification Modal */}
        <Modal isOpen={showCertModal} onClose={() => setShowCertModal(false)} title="Add Certification">
          <form onSubmit={handleAddCertification}>
            <div className="form-group">
              <label>Certification Name</label>
              <input
                type="text"
                className="form-control"
                value={certForm.name}
                onChange={(e) => setCertForm({...certForm, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Issuer</label>
              <input
                type="text"
                className="form-control"
                value={certForm.issuer}
                onChange={(e) => setCertForm({...certForm, issuer: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Date Obtained</label>
              <input
                type="date"
                className="form-control"
                value={certForm.dateObtained}
                onChange={(e) => setCertForm({...certForm, dateObtained: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">Add Certification</button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default StudentDashboard;