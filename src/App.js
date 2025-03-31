import React, { useEffect, useState } from 'react';
import { auth } from './firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import DoctorSetup from './components/DoctorSetup';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import PastRecords from './components/PastRecords';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading, please wait...');
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <Router>
      <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Layout
                  user={user}
                  toggleTheme={toggleTheme}
                  isDarkMode={isDarkMode}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          >
            <Route index element={<Dashboard user={user} />} />
            <Route path="setup" element={<DoctorSetup />} />
            <Route path="records" element={<PastRecords user={user} />} />
          </Route>

          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
