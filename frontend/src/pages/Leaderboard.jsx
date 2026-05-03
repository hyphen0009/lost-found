import React, { useState, useEffect } from 'react';
import { Trophy, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users/leaderboard')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>
      <div className="animate-in" style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
        <Link to="/about" className="icon-btn-secondary" title="About" style={{ position: 'absolute', top: 0, right: 0 }}>
          <Info size={24} />
        </Link>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <Trophy size={48} color="var(--primary)" />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Campus Heroes</h1>
        <p style={{ color: 'var(--text-muted)' }}>Students who made campus better.</p>
      </div>
      
      <div className="animate-in">
        {users.map((u, index) => (
          <div key={u._id} style={{ 
            background: 'white', 
            marginBottom: '10px', 
            padding: '1.25rem', 
            borderRadius: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow)',
            border: index === 0 ? '2px solid var(--secondary)' : '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', width: '40px' }}>
                {index === 0 ? <Trophy size={24} color="#fbbf24" /> : 
                 index === 1 ? <Trophy size={22} color="#94a3b8" /> : 
                 index === 2 ? <Trophy size={20} color="#b45309" /> : 
                 <span style={{ fontWeight: '800', color: '#94a3b8' }}>{index + 1}</span>}
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{u.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{u.gender} • Helper</div>
              </div>
            </div>
            <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.4rem 0.8rem', borderRadius: '10px', fontWeight: '800', fontSize: '0.9rem' }}>
              {u.respectPoints} pts
            </div>
          </div>
        ))}
        
        {users.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            No leaderboard data yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
