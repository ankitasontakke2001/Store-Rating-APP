import React, { useEffect, useState } from 'react';
import API from '../services/api';
import StoreList from '../components/StoreList';

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [q, setQ] = useState('');

  const fetchStores = async (query = q) => {
    try {
      const res = await API.get('/stores', { params: { q: query } }); // ratingRoutes.listStoresForUser
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Fetch stores on mount
  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2>Stores</h2>
      <div>
        <input
          placeholder="Search name or address"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button onClick={() => fetchStores(q)}>Search</button>
      </div>
      <StoreList stores={stores} onRated={() => fetchStores(q)} />
    </div>
  );
}
