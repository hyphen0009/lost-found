import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import { requestNotificationPermission } from '../push-notifications';

const Home = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Request notification permission on first visit
    requestNotificationPermission().catch(console.error);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [search]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      let url = '/api/items';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <section className="mobile-hero animate-in">
        <h1>Campus Hub</h1>
        <p>Reuniting belongings, one post at a time.</p>
      </section>

      <div className="search-box-mobile animate-in">
        <Search size={20} color="#94a3b8" style={{ marginLeft: '1rem' }} />
        <input
          type="text"
          placeholder="Search items..."
          className="search-input-mobile"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '2rem' }}></div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Loading campus items...
        </div>
      ) : (
        <div className="items-list">
          {items.length > 0 ? (
            items.map(item => <ItemCard key={item._id} item={item} />)
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Search size={64} color="#e2e8f0" />
              </div>
              <h3 style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No items found</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', opacity: 0.7 }}>Try a different search or filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
