import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, Trash2, CheckCircle2, ShieldCheck, HelpCircle, Phone, X, Folder } from 'lucide-react';
import { requestNotificationPermission } from '../push-notifications';

const ItemCard = ({ item, isOwnerView = false, onManageClaims }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimData, setClaimData] = useState({ description: '', location: '', uniqueMarks: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    // Request permission on user gesture
    requestNotificationPermission().catch(console.error);
    
    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ itemId: item._id, answers: claimData })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: 'Claim request sent! Wait for founder approval.', type: 'success' });
        setTimeout(() => setShowClaimForm(false), 3000);
      } else {
        setMessage({ text: data.error, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Failed to send claim.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      const res = await fetch(`/api/items/${item._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) { window.location.reload(); }
    } catch (err) {
      // silently handle
    }
  };

  return (

    <div className="card-mobile animate-in">
      <div className="card-body-mobile">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          <h3 className="card-title-mobile" style={{ fontSize: '1.25rem', marginBottom: '0' }}>{item.title}</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {user && item.founder && user._id === (item.founder._id || item.founder) && (
              <button onClick={handleDelete} className="icon-btn-secondary" style={{ padding: '0.4rem', color: '#ef4444' }}>
                <Trash2 size={18} />
              </button>
            )}
            <div className="icon-btn-secondary" style={{ padding: '0.4rem', background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
        </div>

        <div className="card-meta-mobile" style={{ marginBottom: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {item.location}</span>
          {item.founder && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> {item.founder.name}</span>}
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>{item.description}</p>

        {showClaimForm ? (
          <div className="animate-in" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <HelpCircle size={20} color="var(--primary)" />
              <h4 style={{ fontSize: '1rem', fontWeight: '800', margin: 0 }}>Verification</h4>
            </div>
            <form onSubmit={handleClaimSubmit}>
              <textarea
                placeholder="Describe the item in detail..."
                className="input-mobile"
                style={{ marginBottom: '0.75rem', height: '80px' }}
                required
                value={claimData.description}
                onChange={(e) => setClaimData({ ...claimData, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Where did you lose it?"
                className="input-mobile"
                style={{ marginBottom: '0.75rem' }}
                required
                value={claimData.location}
                onChange={(e) => setClaimData({ ...claimData, location: e.target.value })}
              />
              <input
                type="text"
                placeholder="Unique marks/features?"
                className="input-mobile"
                style={{ marginBottom: '1.25rem' }}
                required
                value={claimData.uniqueMarks}
                onChange={(e) => setClaimData({ ...claimData, uniqueMarks: e.target.value })}
              />
              {message.text && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem',
                  color: message.type === 'error' ? '#ef4444' : '#10b981', fontSize: '0.85rem', fontWeight: '600'
                }}>
                  {message.type === 'success' ? <CheckCircle2 size={16} /> : <HelpCircle size={16} />}
                  {message.text}
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={submitting} className="btn-mobile" style={{ flex: 2 }}>
                  {submitting ? 'Sending...' : 'Submit Claim'}
                </button>
                <button type="button" onClick={() => setShowClaimForm(false)} className="btn-mobile" style={{ flex: 1, background: '#e2e8f0', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {isOwnerView ? (
              <button onClick={() => onManageClaims(item._id)} className="btn-mobile" style={{ background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Folder size={18} /> View Claim Requests
              </button>
            ) : (
              <button onClick={() => user ? setShowClaimForm(true) : navigate('/login')} className="btn-mobile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} /> This is mine
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
