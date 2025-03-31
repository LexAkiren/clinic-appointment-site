import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  deleteDoc
} from 'firebase/firestore';

export default function PastRecords({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [viewId, setViewId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    diagnosis: '',
    treatment: '',
    prescription: ''
  });

  const appointmentRef = collection(db, 'appointments');

  useEffect(() => {
    const q = query(appointmentRef, where('userId', '==', user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setAppointments(data.filter(a => a.status === 'done'));
    });
    return () => unsub();
  }, [user.uid]);

  const enterEditMode = (appt) => {
    setEditId(appt.id);
    setViewId(null);
    setEditForm({
      diagnosis: appt.diagnosis || '',
      treatment: appt.treatment || '',
      prescription: appt.prescription || ''
    });
  };

  const saveEdits = async () => {
    const docRef = doc(db, 'appointments', editId);
    await updateDoc(docRef, { ...editForm });
    setEditId(null);
  };

  const deleteAppointment = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await deleteDoc(doc(db, 'appointments', id));
    }
  };

  return (
    <div>
      <h3 className="mb-4">🗂 Past Records</h3>
      {appointments.length === 0 && (
        <p className="text-muted">No completed appointments yet.</p>
      )}

      {appointments.map((appt) => {
        const isViewing = viewId === appt.id;
        const isEditing = editId === appt.id;

        return (
          <div key={appt.id} className="card mb-3 border-success">
            <div className="card-body">
              <h5 className="text-success">{appt.name} — {appt.date}</h5>
              <p>Status: <strong>{appt.status}</strong></p>

              {isViewing && !isEditing && (
                <>
                  <p><strong>Diagnosis:</strong> {appt.diagnosis || '-'}</p>
                  <p><strong>Treatment Plan:</strong> {appt.treatment || '-'}</p>
                  <p><strong>Prescription:</strong> {appt.prescription || '-'}</p>
                </>
              )}

              {isEditing && (
                <>
                  <label className="form-label">Diagnosis</label>
                  <textarea
                    className="form-control mb-2"
                    value={editForm.diagnosis}
                    onChange={(e) => setEditForm({ ...editForm, diagnosis: e.target.value })}
                  />

                  <label className="form-label">Treatment Plan</label>
                  <textarea
                    className="form-control mb-2"
                    value={editForm.treatment}
                    onChange={(e) => setEditForm({ ...editForm, treatment: e.target.value })}
                  />

                  <label className="form-label">Prescription</label>
                  <textarea
                    className="form-control mb-2"
                    value={editForm.prescription}
                    onChange={(e) => setEditForm({ ...editForm, prescription: e.target.value })}
                  />

                  <button className="btn btn-sm btn-success me-2" onClick={saveEdits}>
                    Save & Close
                  </button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditId(null)}>
                    Cancel
                  </button>
                </>
              )}

              {!isEditing && (
                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      setViewId(viewId === appt.id ? null : appt.id);
                      setEditId(null);
                    }}
                  >
                    {isViewing ? 'Hide' : 'View'}
                  </button>
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => enterEditMode(appt)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteAppointment(appt.id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
