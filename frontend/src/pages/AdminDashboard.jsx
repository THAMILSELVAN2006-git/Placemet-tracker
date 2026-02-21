import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import { userAPI, companyAPI } from '../services/api';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({ totalStudents: 0, totalMentors: 0, totalCompanies: 0, activeCompanies: 0 });
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyForm, setCompanyForm] = useState({ name: '', minCGPA: '', ctc: '', location: '', requiredSkills: '', description: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch data using API service functions
      const [studentsRes, mentorsRes, companiesRes] = await Promise.allSettled([
        userAPI.getStudents(),
        userAPI.getMentors(),
        companyAPI.getAllCompanies()
      ]);

      // Process students
      let studentsData = [];
      if (studentsRes.status === 'fulfilled') {
        studentsData = studentsRes.value.data;
      }

      // Process mentors
      let mentorsData = [];
      if (mentorsRes.status === 'fulfilled') {
        mentorsData = mentorsRes.value.data;
      }

      // Process companies
      let companiesData = [];
      if (companiesRes.status === 'fulfilled') {
        companiesData = companiesRes.value.data;
      }

      // Set analytics data
      const analyticsData = {
        totalStudents: studentsData.length,
        totalMentors: mentorsData.length,
        totalCompanies: companiesData.length,
        activeCompanies: companiesData.length
      };

      setStudents(studentsData);
      setMentors(mentorsData);
      setCompanies(companiesData);
      setAnalytics(analyticsData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to connect to server');
      
      // Set mock data to show the interface works
      setStudents([
        { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'student' }
      ]);
      setMentors([
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'mentor' }
      ]);
      setCompanies([
        { _id: '3', name: 'TechCorp', minCGPA: 7.5, ctc: 12, description: 'Leading tech company' }
      ]);
      setAnalytics({ totalStudents: 1, totalMentors: 1, totalCompanies: 1, activeCompanies: 1 });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignStudent = async (mentorId) => {
    try {
      await userAPI.assignStudentToMentor(selectedStudent._id, mentorId);
      await fetchData();
      setShowAssignModal(false);
      setSelectedStudent(null);
      setSuccessMessage('Student assigned successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error assigning student:', error);
      setError('Error assigning student. Please try again.');
      setTimeout(() => setError(null), 3000);
      setShowAssignModal(false);
      setSelectedStudent(null);
    }
  };

  const openAssignModal = (student) => {
    setSelectedStudent(student);
    setShowAssignModal(true);
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCompany) {
        await companyAPI.updateCompany(selectedCompany._id, companyForm);
        setSuccessMessage('Company updated successfully!');
      } else {
        await companyAPI.createCompany(companyForm);
        setSuccessMessage('Company added successfully!');
      }
      
      await fetchData();
      setShowCompanyModal(false);
      setSelectedCompany(null);
      setCompanyForm({ name: '', minCGPA: '', ctc: '', location: '', requiredSkills: '', description: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error with company operation:', error);
      setError('Error with company operation. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companyAPI.deleteCompany(companyId);
        await fetchData();
        setSuccessMessage('Company deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting company:', error);
        setError('Error deleting company. Please try again.');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleDeleteUser = async (userId, userType) => {
    if (window.confirm(`Are you sure you want to delete this ${userType}?`)) {
      try {
        await userAPI.deleteUser(userId);
        await fetchData();
        setSuccessMessage(`${userType} deleted successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error(`Error deleting ${userType}:`, error);
        setError(`Error deleting ${userType}. Please try again.`);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const openCompanyModal = (company = null) => {
    setSelectedCompany(company);
    setCompanyForm(company ? {
      name: company.name,
      minCGPA: company.minCGPA,
      ctc: company.ctc,
      location: company.location || '',
      requiredSkills: company.requiredSkills ? company.requiredSkills.join(', ') : '',
      description: company.description || ''
    } : { name: '', minCGPA: '', ctc: '', location: '', requiredSkills: '', description: '' });
    setShowCompanyModal(true);
  };

  if (loading) return <Loading message="Loading admin dashboard..." />;

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 style={{ marginBottom: '30px', color: '#374151' }}>Admin Dashboard</h1>

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

        {error && (
          <div style={{ 
            background: '#fef3c7', 
            color: '#92400e', 
            padding: '12px', 
            borderRadius: '6px', 
            marginBottom: '20px',
            border: '1px solid #fbbf24'
          }}>
            ⚠️ {error}
            <button 
              onClick={fetchData} 
              style={{ 
                marginLeft: '10px', 
                padding: '4px 8px', 
                fontSize: '12px',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Analytics Section */}
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>System Analytics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{analytics.totalStudents}</div>
              <div className="stat-label">Total Students</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{analytics.totalMentors}</div>
              <div className="stat-label">Total Mentors</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{analytics.totalCompanies}</div>
              <div className="stat-label">Total Companies</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{analytics.activeCompanies}</div>
              <div className="stat-label">Active Companies</div>
            </div>
          </div>
        </div>

        {/* Student Management */}
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>Student Management ({students.length})</h2>
          {students.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>
                      <span style={{ 
                        background: '#3b82f6', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px' 
                      }}>
                        {student.role}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-primary"
                        onClick={() => openAssignModal(student)}
                        style={{ marginRight: '8px' }}
                      >
                        Assign Mentor
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteUser(student._id, 'student')}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h3 style={{ color: '#6b7280' }}>No students found</h3>
              <p style={{ color: '#9ca3af' }}>Students will appear here once they register.</p>
            </div>
          )}
        </div>

        {/* Mentor Management */}
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>Mentor Management ({mentors.length})</h2>
          {mentors.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mentors.map((mentor) => (
                  <tr key={mentor._id}>
                    <td>{mentor.name}</td>
                    <td>{mentor.email}</td>
                    <td>
                      <span style={{ 
                        background: '#f59e0b', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px' 
                      }}>
                        {mentor.role}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteUser(mentor._id, 'mentor')}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h3 style={{ color: '#6b7280' }}>No mentors found</h3>
              <p style={{ color: '#9ca3af' }}>Mentors will appear here once they register.</p>
            </div>
          )}
        </div>

        {/* Company Management */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Company Management ({companies.length})</h2>
            <button className="btn btn-primary" onClick={() => openCompanyModal()}>
              Add Company
            </button>
          </div>
          {companies.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Min CGPA</th>
                  <th>CTC (LPA)</th>
                  <th>Location</th>
                  <th>Required Skills</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company._id}>
                    <td style={{ fontWeight: 'bold' }}>{company.name}</td>
                    <td>
                      <span style={{ 
                        background: '#10b981', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px' 
                      }}>
                        {company.minCGPA}
                      </span>
                    </td>
                    <td style={{ color: '#059669', fontWeight: 'bold' }}>{company.ctc} LPA</td>
                    <td>{company.location || 'Not specified'}</td>
                    <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {company.requiredSkills ? company.requiredSkills.join(', ') : 'None'}
                    </td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {company.description}
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => openCompanyModal(company)}
                        style={{ marginRight: '8px' }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteCompany(company._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h3 style={{ color: '#6b7280' }}>No companies found</h3>
              <p style={{ color: '#9ca3af' }}>Add companies for student placements.</p>
              <button className="btn btn-primary" onClick={() => openCompanyModal()}>
                Add First Company
              </button>
            </div>
          )}
        </div>

        {/* Company Modal */}
        <Modal 
          isOpen={showCompanyModal} 
          onClose={() => setShowCompanyModal(false)} 
          title={selectedCompany ? 'Edit Company' : 'Add New Company'}
        >
          <form onSubmit={handleCompanySubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Company Name</label>
              <input
                type="text"
                value={companyForm.name}
                onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Minimum CGPA</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={companyForm.minCGPA}
                onChange={(e) => setCompanyForm({...companyForm, minCGPA: e.target.value})}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>CTC (in LPA)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={companyForm.ctc}
                onChange={(e) => setCompanyForm({...companyForm, ctc: e.target.value})}
                placeholder="e.g., 12"
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Location</label>
              <input
                type="text"
                value={companyForm.location}
                onChange={(e) => setCompanyForm({...companyForm, location: e.target.value})}
                required
                placeholder="e.g., Bangalore, Mumbai"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Required Skills (comma separated)</label>
              <input
                type="text"
                value={companyForm.requiredSkills}
                onChange={(e) => setCompanyForm({...companyForm, requiredSkills: e.target.value})}
                placeholder="e.g., JavaScript, React, Node.js"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
              <textarea
                value={companyForm.description}
                onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})}
                rows="3"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowCompanyModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {selectedCompany ? 'Update' : 'Add'} Company
              </button>
            </div>
          </form>
        </Modal>

        {/* Assign Student Modal */}
        <Modal 
          isOpen={showAssignModal} 
          onClose={() => setShowAssignModal(false)} 
          title={`Assign ${selectedStudent?.name} to Mentor`}
        >
          <div>
            <h4 style={{ marginBottom: '20px' }}>Select a Mentor:</h4>
            {mentors.length > 0 ? (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {mentors.map((mentor) => (
                  <div 
                    key={mentor._id} 
                    style={{ 
                      padding: '15px', 
                      border: '1px solid #ddd', 
                      borderRadius: '8px', 
                      marginBottom: '10px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => handleAssignStudent(mentor._id)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <div style={{ fontWeight: 'bold' }}>{mentor.name}</div>
                    <div style={{ color: '#666', fontSize: '14px' }}>{mentor.email}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>
                      Role: {mentor.role}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>No mentors available. Please register mentors first.</p>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;