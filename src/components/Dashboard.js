import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase-config';
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc,
  getDoc
} from 'firebase/firestore';

export default function Dashboard({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ name: '', date: '', notes: '', status: 'pending' });
  const [profile, setProfile] = useState(null);

  const appointmentRef = collection(db, 'appointments');

  // Load doctor's profile
  useEffect(() => {
    const fetchProfile = async () => {
      const profileDoc = await getDoc(doc(db, 'doctors', user.uid));
      if (profileDoc.exists()) {
        setProfile(profileDoc.data());
      }
    };
    fetchProfile();
  }, [user.uid]);

  // Listen for appointment changes
  useEffect(() => {
    const q = query(appointmentRef, where('userId', '==', user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setAppointments(data);
    });
    return () => unsub();
  }, [user.uid]);

  const createAppointment = async () => {
    if (!form.name || !form.date) return;
    await addDoc(appointmentRef, {
      ...form,
      userId: user.uid
    });
    setForm({ name: '', date: '', notes: '', status: 'pending' });
  };

  const updateStatus = async (id, newStatus) => {
    const docRef = doc(db, 'appointments', id);
    await updateDoc(docRef, { status: newStatus });
  };

  const updateNotes = async (id, notes) => {
    const docRef = doc(db, 'appointments', id);
    await updateDoc(docRef, { notes });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Doctor Dashboard</h3>
        <button className="btn btn-danger" onClick={() => signOut(auth)}>Log Out</button>
      </div>

      {/* Doctor Profile Info */}
      {profile && (
        <div className="alert alert-info">
          <h5>Dr. {profile.name}</h5>
          <p><strong>Specialization:</strong> {profile.specialization}</p>
          <p><strong>Contact:</strong> {profile.contact}</p>
          <p>{profile.bio}</p>
        </div>
      )}

      {/* New Appointment Form */}
      <h4 className="mt-4">Add New Appointment</h4>
      <input
        className="form-control mb-2"
        placeholder="Patient Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="form-control mb-2"
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />
      <textarea
        className="form-control mb-2"
        placeholder="Initial Notes"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />
      <button className="btn btn-success mb-4" onClick={createAppointment}>
        Save Appointment
      </button>

      {/* Appointments List */}
      <h4>Appointments</h4>
      {appointments.map((appt) => (
        <div key={appt.id} className="card mb-3">
          <div className="card-body">
            <h5>{appt.name} — {appt.date}</h5>
            <p>Status: <strong>{appt.status}</strong></p>
            <select
              className="form-select mb-2"
              value={appt.status}
              onChange={(e) => updateStatus(appt.id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="on-going">On-going</option>
              <option value="done">Done</option>
            </select>
            <textarea
              className="form-control"
              value={appt.notes}
              onChange={(e) => updateNotes(appt.id, e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
