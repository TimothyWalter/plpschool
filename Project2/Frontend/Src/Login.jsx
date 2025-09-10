import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const resp = await axios.post('/api/admin/login', { username, password });
      const token = resp.data.token;
      localStorage.setItem('admin_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/admin');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm">Username</label>
            <input value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border rounded p-2" />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <div>
            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
