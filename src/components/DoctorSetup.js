import React, { useState } from 'react';
import { auth, db } from '../firebase-config';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function DoctorSetup() {
  const [form, setForm] = useState({
    name: '',
    specialization: '',
    contact: '',
    bio: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await setDoc(doc(db, 'doctors', user.uid), {
        ...form,
        userId: user.uid,
        email: user.email
      });
      navigate('/');
    } catch (err) {
      console.error("Failed to save profile:", err.message);
    }
  };

  return (
    <div>
      <h2>Set Up Your Profile</h2>
      <input className="form-control mb-2" placeholder="Full Name" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="form-control mb-2" placeholder="Specialization" value={form.specialization}
        onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
      <input className="form-control mb-2" placeholder="Contact Info" value={form.contact}
        onChange={(e) => setForm({ ...form, contact: e.target.value })} />
      <textarea className="form-control mb-2" placeholder="Bio / Notes" value={form.bio}
        onChange={(e) => setForm({ ...form, bio: e.target.value })} />
      <button className="btn btn-primary" onClick={handleSubmit}>Save Profile</button>
    </div>
  );
}
