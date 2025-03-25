import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div>
      <h2>Doctor Login</h2>
      {error && <p className="text-danger">{error}</p>}
      <input type="email" className="form-control mb-2" placeholder="Email"
        value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" className="form-control mb-2" placeholder="Password"
        value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="btn btn-primary" onClick={login}>Login</button>
      <p className="mt-2">
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}
