import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        navigate('/');
      } else {
        setError(data.error || 'Login failed on server');
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running.');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="form-mobile animate-in">
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Welcome Back</h2>
        {error && <p style={{ color: 'var(--primary)', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group-mobile">
            <label className="label-mobile">Email</label>
            <input type="email" className="input-mobile" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
          </div>
          <div className="form-group-mobile">
            <label className="label-mobile">Password</label>
            <input type="password" className="input-mobile" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-mobile" style={{ border: 'none' }}>Login</button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          New here? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>Create account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
