import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await API.get('/admin/dashboard');
        setStats(statsRes.data);

        const usersRes = await API.get('/admin/users', { params: { q } });
        setUsers(usersRes.data);

        const storesRes = await API.get('/admin/stores', { params: { q } });
        setStores(storesRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [q]); // ✅ runs once on mount without warnings

  async function fetchUsers() {
    try {
      const res = await API.get('/admin/users', { params: { q } });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchStores() {
    try {
      const res = await API.get('/admin/stores', { params: { q } });
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {stats && (
        <div>
          <p>Total Users: {stats.totalUsers}</p>
          <p>Total Stores: {stats.totalStores}</p>
          <p>Total Ratings: {stats.totalRatings}</p>
        </div>
      )}

      <div>
        <h3>Search</h3>
        <input
          placeholder="search name/email/address"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          onClick={() => {
            fetchUsers();
            fetchStores();
          }}
        >
          Search
        </button>
      </div>

      <div>
        <h3>Users</h3>
        {users.map((u) => (
          <div
            key={u.id}
            style={{ border: '1px solid #ddd', padding: 8, marginBottom: 6 }}
          >
            <div>
              {u.name} — {u.email} — {u.address} — <strong>{u.role}</strong>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3>Stores</h3>
        {stores.map((s) => (
          <div
            key={s.id}
            style={{ border: '1px solid #ddd', padding: 8, marginBottom: 6 }}
          >
            <div>
              {s.name} — {s.email} — {s.address} — Rating:{' '}
              {s.avgRating ?? 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
