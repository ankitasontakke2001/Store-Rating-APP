import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
const [form, setForm] = useState({ name:'', email:'', address:'', password:'' });
const navigate = useNavigate();

async function submit(e) {
    e.preventDefault();
    // simple front validation (back also validates)
    if (form.name.length < 20 || form.name.length > 60) return alert('Name 20-60 chars');
    if (form.address.length > 400) return alert('Address max 400 chars');
    if (form.password.length < 8 || form.password.length > 16) return alert('Password 8-16 chars');

    try {
    await API.post('/auth/signup', form);
    alert('Signup success. Login now.');
    navigate('/login');
    } catch (err) {
    alert(err.response?.data?.message || 'Signup error');
    }
}

return (
    <form onSubmit={submit}>
    <h2>Signup</h2>
    <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
    <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
    <textarea placeholder="Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} />
    <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
    <button type="submit">Signup</button>
    </form>
);
}
