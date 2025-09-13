import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function OwnerDashboard() {
  const [info, setInfo] = useState(null);

  async function fetchInfo() {
    try {
      const res = await API.get('/store/owner/info');
      setInfo(res.data);
    } catch(err) { console.error(err); }
  }

  useEffect(()=>{ fetchInfo(); }, []);

  if (!info) return <p>Loading...</p>;

  return (
    <div>
      <h2>Owner Dashboard</h2>
      <p>Store: {info.store.name} ({info.store.email})</p>
      <p>Avg Rating: {info.avgRating}</p>
      <h3>Ratings</h3>
      {info.ratings.map(r => (
        <div key={r.id} style={{border:'1px solid #ddd', padding:8, marginBottom:6}}>
          <div>By: {r.User?.name} ({r.User?.email}) — Score: {r.score}</div>
          <div>On: {new Date(r.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
