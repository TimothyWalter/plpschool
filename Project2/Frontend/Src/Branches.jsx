import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Branches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', location: '', contact: '' });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState('');

  useEffect(()=>{ fetchBranches(); }, []);

  async function fetchBranches() {
    try {
      const resp = await axios.get('/api/admin/branches');
      setBranches(resp.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load branches (are you logged in?)');
    } finally { setLoading(false); }
  }

  function openNew() {
    setEditingId(null);
    setForm({ name: '', location: '', contact: '' });
  }

  function openEdit(b) {
    setEditingId(b._id);
    setForm({ name: b.name, location: b.location, contact: b.contact });
  }

  async function save() {
    const errs = {};
    if (!form.name) errs.name = 'Name is required';
    if (!form.location) errs.location = 'Location is required';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      if (editingId) {
        await axios.put('/api/admin/branches/' + editingId, form);
      } else {
        await axios.post('/api/admin/branches', form);
      }
      await fetchBranches();
      setForm({ name: '', location: '', contact: '' });
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  }

  async function remove(id) {
    if (!confirm('Delete branch?')) return;
    try {
      await axios.delete('/api/admin/branches/' + id);
      await fetchBranches();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }

  if (loading) return <div className="p-4">Loading branches...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Branch Management</h1>
      <div className="mb-4 flex gap-2">
        <input className=\"border rounded p-2 flex-1\" placeholder=\"Search branches...\" value={search} onChange={(e)=>setSearch(e.target.value)} />
        <button onClick={openNew} className="bg-green-600 text-white px-3 py-1 rounded">New Branch</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Location</th>
              <th className="border px-3 py-2 text-left">Contact</th>
              <th className="border px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.filter(b=> b.name.toLowerCase().includes(search.toLowerCase()) || b.location.toLowerCase().includes(search.toLowerCase())).map(b => (
              <tr key={b._id}>
                <td className="border px-3 py-2">{b.name}</td>
                <td className="border px-3 py-2">{b.location}</td>
                <td className="border px-3 py-2">{b.contact}</td>
                <td className="border px-3 py-2">
                  <button onClick={() => openEdit(b)} className="mr-2 text-blue-600">Edit</button>
                  <button onClick={() => remove(b._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow max-w-md">
        <h2 className="font-semibold mb-2">{editingId ? 'Edit Branch' : 'New Branch'}</h2>
        <div className="space-y-2">
          <div>
            <input className="w-full border rounded p-2" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <input className="w-full border rounded p-2" placeholder="Location" value={form.location} onChange={(e)=>setForm({...form, location: e.target.value})} />
          </div>
          <div>
            <input className="w-full border rounded p-2" placeholder="Contact" value={form.contact} onChange={(e)=>setForm({...form, contact: e.target.value})} />
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
            <button onClick={openNew} className="px-3 py-1 border rounded">Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
}
