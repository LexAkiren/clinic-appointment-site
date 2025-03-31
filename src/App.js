import React, { useEffect, useState } from 'react';
import { auth } from './firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import DoctorSetup from './components/DoctorSetup';
import Dashboard from './components/Dashboard';
import './App.css'; 

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading, please wait...');
  const [isDarkMode, setIsDarkMode] = useState(false); // For night mode toggle

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
      setLoadingMessage('Initializing application...');
    });
    return () => unsubscribe();
  }, []);

  if (!authChecked) return <div className="loading-screen">{loadingMessage}</div>;

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode); // Toggle dark mode
  };

  return (
    <Router>
      <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="App-header">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <Routes>
            <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="/setup" element={user ? <DoctorSetup /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
