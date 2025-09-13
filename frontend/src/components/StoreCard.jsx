import React, { useState } from 'react';
import API from '../services/api';

export default function StoreCard({ store, onRated }) {
  const [score, setScore] = useState(store.userRating || '');
  const isUser = localStorage.getItem('role') === 'user';

  async function submit() {
    if (!isUser) return alert('Only normal users can rate');
    const s = parseInt(score);
    if (!s || s < 1 || s > 5) return alert('Enter 1-5');
    try {
      await API.post(`/stores/${store.id}/rate`, { score: s });
      alert('Saved');
      onRated && onRated();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  }

  return (
    <div className="store-card">
      <h3>{store.name}</h3>
      <p><strong>Address:</strong> {store.address}</p>
      <p><strong>Overall Rating:</strong> {store.avgRating ?? 0}</p>
      <p><strong>Your Rating:</strong> {store.userRating ?? 'Not rated'}</p>

      {isUser && <>
        <input type="number" min="1" max="5" placeholder="1-5" value={score} onChange={e=>setScore(e.target.value)} />
        <button onClick={submit}>Submit / Update Rating</button>
      </>}
    </div>
  );
}
