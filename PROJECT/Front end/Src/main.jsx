import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import App from './App.jsx'
import Admin from './Admin.jsx'
import Branches from './Branches.jsx'
import Login from './Login.jsx'
import './index.css'

// attach token if present
const token = localStorage.getItem('admin_token');
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

function RouterApp() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-800 p-4 text-white flex gap-4">
        <Link to="/" className="hover:underline">Shop</Link>
        <Link to="/admin" className="hover:underline">Admin</Link>
        <Link to="/login" className="hover:underline">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/branches" element={<Branches />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterApp />
  </React.StrictMode>,
)
