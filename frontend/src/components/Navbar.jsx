import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav style={{padding:'12px', borderBottom:'1px solid #eee'}}>
      <Link to="/">Home</Link>
      {!token && <>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </>}
      {token && <>
        {role === 'admin' && <Link to="/admin">Admin</Link>}
        {role === 'user' && <Link to="/user">Stores</Link>}
        {role === 'owner' && <Link to="/owner">Owner</Link>}
        <button onClick={logout} style={{marginLeft:10}}>Logout</button>
      </>}
    </nav>
  );
}
