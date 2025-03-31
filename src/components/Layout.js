import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { auth } from '../firebase-config';
import { signOut } from 'firebase/auth';

export default function Layout({ user, toggleTheme, isDarkMode }) {
  return (
    <div className="container-fluid p-0 m-0">
      <div className="row g-0 vh-100">
        {/* Sidebar */}
        <div className="col-12 col-md-3 col-lg-2 bg-dark text-light d-flex flex-column p-3">
          <h4 className="text-white mb-4">🩺 Clinic Panel</h4>
          <nav className="nav flex-column mb-4">
            <Link to="/" className="nav-link text-light">Dashboard</Link>
            <Link to="/setup" className="nav-link text-light">Edit Profile</Link>
            <Link to="/records" className="nav-link text-light">Past Records</Link>
          </nav>

          {/* Theme toggle button */}
          <button className="btn btn-outline-light mb-3" onClick={toggleTheme}>
            {isDarkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
          </button>

          <div className="mt-auto">
            <button className="btn btn-danger w-100" onClick={() => signOut(auth)}>
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-12 col-md-9 col-lg-10 bg-light p-4 overflow-auto">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <h2 className="mb-2">Welcome, Doctor</h2>
            <div className="text-end">
              <p className="mb-0 fw-bold text-secondary" style={{ fontSize: "0.9rem" }}>{user?.email}</p>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
