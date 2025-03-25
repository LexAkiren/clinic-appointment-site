import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const register = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      navigate('/setup');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Doctor Registration</h2>
      {error && <p className="text-danger">{error}</p>}
      <input type="email" className="form-control mb-2" placeholder="Email"
        value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" className="form-control mb-2" placeholder="Password"
        value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="btn btn-success" onClick={register}>Register</button>
      <p className="mt-2">
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}
