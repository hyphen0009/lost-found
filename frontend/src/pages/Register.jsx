import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', gender: 'male' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        navigate('/');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Cannot connect to server.');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="form-mobile animate-in">
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Join Community</h2>
        {error && <p style={{ color: 'var(--primary)', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group-mobile">
            <label className="label-mobile">Full Name</label>
            <input type="text" className="input-mobile" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Rahul Kumar" />
          </div>
          <div className="form-group-mobile">
            <label className="label-mobile">Email</label>
            <input type="email" className="input-mobile" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="rahul@univ.edu" />
          </div>
          <div className="form-group-mobile">
            <label className="label-mobile">Password</label>
            <input type="password" className="input-mobile" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
          </div>
          <div className="form-group-mobile">
            <label className="label-mobile">Gender</label>
            <select className="input-mobile" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button type="submit" className="btn-mobile" style={{ border: 'none' }}>Join Now</button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
