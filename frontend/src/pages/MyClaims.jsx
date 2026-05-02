import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { useAuth } from '../AuthContext';

const MyClaims = () => {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/claims/my-claims', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => {
        setClaims(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
    }
  }, [user]);

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>
      <header className="animate-in" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>My Claims</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Check the status of your item recovery requests.</p>
      </header>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading your claims...</div>
      ) : (
        <div className="items-list">
          {claims.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Briefcase size={64} color="#e2e8f0" />
              </div>
              <h3 style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No claims yet</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', opacity: 0.7 }}>Items you claim will appear here.</p>
            </div>
          ) : (
            claims.map(claim => (
              <div key={claim._id} className="card-mobile animate-in" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>{claim.item?.title || 'Unknown Item'}</h3>
                        <span style={{ 
                          padding: '0.25rem 0.6rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '800',
                          background: claim.status === 'approved' ? '#dcfce7' : claim.status === 'rejected' ? '#fee2e2' : '#f1f5f9',
                          color: claim.status === 'approved' ? '#10b981' : claim.status === 'rejected' ? '#ef4444' : '#64748b'
                        }}>
                          {claim.status.toUpperCase()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Requested on {new Date(claim.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '0 1rem 1rem 1rem' }}>
                  {claim.status === 'approved' && (
                    <div className="animate-in" style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
                      <p style={{ fontSize: '0.8rem', color: '#166534', marginBottom: '0.5rem', fontWeight: 'bold' }}>🎉 Verification Successful!</p>
                      <a href={`tel:${claim.item?.contact}`} className="btn-mobile" style={{ background: '#10b981', textDecoration: 'none', padding: '0.7rem', fontSize: '0.9rem' }}>
                        📞 Call Founder: {claim.item?.contact}
                      </a>
                    </div>
                  )}

                  {claim.status === 'pending' && (
                    <div style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      🕒 The finder is reviewing your answers. We'll reveal the contact info once they approve.
                    </div>
                  )}

                  {claim.status === 'rejected' && (
                    <div style={{ background: '#fff1f2', padding: '0.8rem', borderRadius: '12px', fontSize: '0.8rem', color: '#be123c' }}>
                      ❌ Your verification details did not match. You can try again if you have more details.
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <div style={{ paddingBottom: '5rem' }}></div>
    </div>
  );
};

export default MyClaims;
