// src/components/DoctorSetup.js
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function DoctorSetup() {
  const [form, setForm] = useState({
    name: '',
    specialization: '',
    contact: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const profileRef = doc(db, 'doctors', user.uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        setForm(profileSnap.data());
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    const profileRef = doc(db, 'doctors', user.uid);
    await setDoc(profileRef, {
      ...form,
      userId: user.uid
    });
    navigate('/'); // Go to dashboard after saving
  };

  if (loading) return <div className="auth-container"><p>Loading...</p></div>;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Complete Your Profile</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="form-input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Specialization"
          className="form-input"
          value={form.specialization}
          onChange={(e) => setForm({ ...form, specialization: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contact Number"
          className="form-input"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
        />
        <textarea
          placeholder="Short Bio"
          className="form-input"
          rows={3}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />

        <button className="auth-btn mt-2" onClick={handleSave}>Save Profile</button>
        <a href="/" className="auth-link">Skip for now</a>
      </div>
    </div>
  );
}
