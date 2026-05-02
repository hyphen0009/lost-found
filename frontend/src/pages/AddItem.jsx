import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { requestNotificationPermission } from '../push-notifications';

const AddItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', category: 'lost', location: '', color: '', contact: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Request permission on user gesture
    requestNotificationPermission().catch(console.error);
    
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) { navigate('/'); }
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>
      <div className="form-mobile animate-in">
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Post New Item</h2>
        <form onSubmit={handleSubmit} className="animate-in">
          <div style={{ marginBottom: '1.2rem' }}>
            <label className="label-mobile">Item Name</label>
            <input type="text" name="title" required className="input-mobile" placeholder="e.g. iPhone 15 Pro" value={formData.title} onChange={handleChange} />
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label className="label-mobile">Description (Details for owner)</label>
            <textarea name="description" required className="input-mobile" style={{ height: '100px' }} placeholder="Mention specific details..." value={formData.description} onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '1.2rem' }}>
            <div style={{ flex: 1 }}>
              <label className="label-mobile">Status</label>
              <div className="input-mobile" style={{ background: '#f0fdf4', color: '#10b981', fontWeight: '800', textAlign: 'center', border: '1px solid #bbf7d0' }}>FOUND</div>
            </div>
            <div style={{ flex: 1 }}>
              <label className="label-mobile">Color</label>
              <input type="text" name="color" required className="input-mobile" placeholder="e.g. Blue" value={formData.color} onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label className="label-mobile">Found Location</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" name="location" required className="input-mobile" style={{ paddingLeft: '40px' }} placeholder="e.g. Library 2nd Floor" value={formData.location} onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label className="label-mobile">Your Contact (WhatsApp/Phone)</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" name="contact" required className="input-mobile" style={{ paddingLeft: '40px' }} placeholder="e.g. +91 98765 43210" value={formData.contact} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="btn-mobile" disabled={submitting} style={{ border: 'none' }}>
            {submitting ? 'Posting...' : 'Confirm Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
