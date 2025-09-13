import React from 'react';
import StoreCard from './StoreCard';

export default function StoreList({ stores = [], onRated }) {
  return (
    <div>
      {stores.map(s => <StoreCard key={s.id} store={s} onRated={onRated} />)}
    </div>
  );
}
