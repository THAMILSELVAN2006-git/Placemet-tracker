import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <a href="/" className="navbar-brand">
            Placement Tracker
          </a>
          <div className="navbar-nav">
            <span className="nav-link">Welcome, {user?.name}</span>
            <span className="nav-link">Role: {user?.role}</span>
            <button onClick={logout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;