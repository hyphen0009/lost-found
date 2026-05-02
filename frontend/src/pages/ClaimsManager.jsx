import React, { useState, useEffect } from 'react';
import { Folder, ArrowLeft, ClipboardCheck, User, MapPin, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';
import ItemCard from '../components/ItemCard';

const ClaimsManager = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [selectedItemClaims, setSelectedItemClaims] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchMyItems();
  }, [user]);

  const fetchMyItems = async () => {
    try {
      const res = await fetch('/api/items/my-items', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setItems(data);
    } catch (err) {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  const fetchClaimsForItem = async (itemId) => {
    try {
      const res = await fetch(`/api/claims/item/${itemId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setSelectedItemClaims({ itemId, claims: data });
    } catch (err) {
      // silently handle
    }
  };

  const handleUpdateStatus = async (claimId, status) => {
    try {
      const res = await fetch(`/api/claims/${claimId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchClaimsForItem(selectedItemClaims.itemId);
      }
    } catch (err) {
      // silently handle
    }
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>
      <div className="animate-in" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Manage My Posts</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Review verification requests for items you found.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading your posts...</div>
      ) : (
        <div className="items-list">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Folder size={64} color="#e2e8f0" />
              </div>
              <h3 style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No posts yet</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', opacity: 0.7 }}>Items you post will appear here for management.</p>
            </div>
          ) : (
            items.map(item => (
              <ItemCard
                key={item._id}
                item={item}
                isOwnerView={true}
                onManageClaims={fetchClaimsForItem}
              />
            ))
          )}
        </div>
      )}

      {selectedItemClaims && (
        <div className="animate-in" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'white', zIndex: 2000, overflowY: 'auto'
        }}>
          <div style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 2001 }}>
            <button onClick={() => setSelectedItemClaims(null)} className="icon-btn-secondary" style={{ padding: '0.5rem' }}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Claim Requests</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verify ownership to return the item.</p>
            </div>
          </div>

          <div className="container" style={{ padding: '1.5rem 1.25rem' }}>
            {selectedItemClaims.claims.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <ClipboardCheck size={48} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
                <p style={{ color: 'var(--text-muted)' }}>No claims received for this item yet.</p>
              </div>
            ) : (
              selectedItemClaims.claims.map(claim => (
                <div key={claim._id} className="animate-in" style={{
                  background: 'white',
                  border: '1px solid var(--border)',
                  padding: '1.5rem',
                  borderRadius: '24px',
                  marginBottom: '1.5rem',
                  boxShadow: 'var(--shadow)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ background: 'var(--primary-light)', padding: '0.5rem', borderRadius: '10px' }}>
                        <User size={18} color="var(--primary)" />
                      </div>
                      <span style={{ fontWeight: '700', fontSize: '1rem' }}>{claim.claimant.name}</span>
                    </div>
                    <span style={{
                      padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '800',
                      background: claim.status === 'approved' ? '#dcfce7' : claim.status === 'rejected' ? '#fee2e2' : '#f1f5f9',
                      color: claim.status === 'approved' ? '#10b981' : claim.status === 'rejected' ? '#ef4444' : '#64748b',
                      textTransform: 'uppercase', letterSpacing: '0.5px'
                    }}>
                      {claim.status}
                    </span>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Item Description</label>
                      <p style={{ color: '#1e293b', lineHeight: '1.5' }}>{claim.answers.description}</p>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Lost Location</label>
                      <p style={{ color: '#1e293b', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {claim.answers.location}</p>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Unique Marks</label>
                      <p style={{ color: '#1e293b' }}>{claim.answers.uniqueMarks}</p>
                    </div>
                  </div>

                  {claim.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleUpdateStatus(claim._id, 'approved')}
                        className="btn-mobile" style={{ background: '#10b981', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', border: 'none' }}
                      >
                        <CheckCircle2 size={18} /> Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(claim._id, 'rejected')}
                        className="btn-mobile" style={{ background: '#ef4444', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', border: 'none' }}
                      >
                        <XCircle size={18} /> Reject
                      </button>
                    </div>
                  ) : claim.status === 'approved' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', padding: '0.75rem', background: '#f0fdf4', borderRadius: '12px', justifyContent: 'center' }}>
                      <CheckCircle2 size={18} />
                      <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Contact revealed to claimant</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', padding: '0.75rem', background: '#fef2f2', borderRadius: '12px', justifyContent: 'center' }}>
                      <XCircle size={18} />
                      <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Claim rejected</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <div style={{ paddingBottom: '5rem' }}></div>
    </div>
  );
};

export default ClaimsManager;
