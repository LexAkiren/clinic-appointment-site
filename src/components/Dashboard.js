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
  getDoc,
  deleteDoc
} from 'firebase/firestore';

export default function Dashboard({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ name: '', date: '' });
  const [profile, setProfile] = useState(null);
  const [openId, setOpenId] = useState(null);

  const appointmentRef = collection(db, 'appointments');

  useEffect(() => {
    const fetchProfile = async () => {
      const profileDoc = await getDoc(doc(db, 'doctors', user.uid));
      if (profileDoc.exists()) {
        setProfile(profileDoc.data());
      }
    };
    fetchProfile();
  }, [user.uid]);

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
      userId: user.uid,
      status: 'pending'
    });
    setForm({ name: '', date: '' });
  };

  const updateAppointment = async (id, field, value) => {
    const docRef = doc(db, 'appointments', id);
    await updateDoc(docRef, { [field]: value });
  };

  const handleStart = async (appt) => {
    setOpenId(appt.id);
    if (appt.status !== 'on-going') {
      await updateAppointment(appt.id, 'status', 'on-going');
    }
  };

  const handleDone = async (id) => {
    await updateAppointment(id, 'status', 'done');
    setOpenId(null);
  };

  const deleteAppointment = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      await deleteDoc(doc(db, 'appointments', id));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Doctor Dashboard</h3>
        <button className="btn btn-danger" onClick={() => signOut(auth)}>Log Out</button>
      </div>

      {profile && (
        <div className="alert alert-info">
          <h5>Dr. {profile.name}</h5>
          <p><strong>Specialization:</strong> {profile.specialization}</p>
          <p><strong>Contact:</strong> {profile.contact}</p>
          <p>{profile.bio}</p>
        </div>
      )}

      {/* Create Appointment */}
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
      <button className="btn btn-success mb-4" onClick={createAppointment}>
        Save Appointment
      </button>

      {/* Upcoming & Active */}
      <h4>Upcoming & Active Appointments</h4>
      {appointments.filter(a => a.status !== 'done').map((appt) => (
        <div key={appt.id} className="card mb-3">
          <div className="card-body">
            <h5>{appt.name} — {appt.date}</h5>
            <p>Status: <strong>{appt.status}</strong></p>

            {openId === appt.id ? (
              <>
                <textarea
                  className="form-control mb-2"
                  placeholder="Diagnosis"
                  value={appt.diagnosis || ''}
                  onChange={(e) => updateAppointment(appt.id, 'diagnosis', e.target.value)}
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Treatment Plan"
                  value={appt.treatment || ''}
                  onChange={(e) => updateAppointment(appt.id, 'treatment', e.target.value)}
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Prescription"
                  value={appt.prescription || ''}
                  onChange={(e) => updateAppointment(appt.id, 'prescription', e.target.value)}
                />
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-secondary" onClick={() => setOpenId(null)}>
                    Close
                  </button>
                  <button className="btn btn-success" onClick={() => handleDone(appt.id)}>
                    ✅ Mark as Done
                  </button>
                </div>
              </>
            ) : (
              <>
                <button className="btn btn-primary me-2" onClick={() => handleStart(appt)}>
                  Start Appointment
                </button>
                <button className="btn btn-outline-danger btn-sm mt-2" onClick={() => deleteAppointment(appt.id)}>
                  🗑 Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
