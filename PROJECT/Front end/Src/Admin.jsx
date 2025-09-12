import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/login');
      return;
    }

    async function fetchOrders() {
      try {
        const resp = await axios.get('/api/admin/orders');
        setOrders(resp.data);
      } catch (err) {
        console.error(err);
        if (err?.response?.status === 401) {
          localStorage.removeItem('admin_token');
          navigate('/login');
          return;
        }
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [navigate]);

  if (loading) return <div className="p-4">Loading orders...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    
      <div className="mb-4">
        <a className="mr-4 text-blue-600" href="/admin">Orders</a>
        <a className="text-blue-600" href="/admin/branches">Branches</a>
      </div>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Order ID</th>
              <th className="border px-3 py-2 text-left">Customer</th>
              <th className="border px-3 py-2 text-left">Total</th>
              <th className="border px-3 py-2 text-left">Status</th>
              <th className="border px-3 py-2 text-left">Created At</th>
            
  <td>
    {o.status !== "shipped" && (
      <button
        className="bg-green-500 text-white px-3 py-1 rounded"
        onClick={async () => {
          await axios.post(`/api/orders/${o.orderId}/ship`);
          fetchOrders();
        }}
      >
        Mark Shipped
      </button>
    )}
  </td>

  <td>
    {o.status === "shipped" && (
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded"
        onClick={async () => {
          await axios.post(`/api/orders/${o.orderId}/deliver`);
          fetchOrders();
        }}
      >
        Mark Delivered
      </button>
    )}
  </td>
</tr>
          </thead>
          <tbody>
            {orders.map((o) => (
          <tr>
                <td className="border px-3 py-2">{o.orderId}</td>
                <td className="border px-3 py-2">{o.customer?.name} ({o.customer?.phone})</td>
                <td className="border px-3 py-2">KSh {o.total?.toLocaleString()}</td>
                <td className="border px-3 py-2">{o.status}</td>
                <td className="border px-3 py-2">{new Date(o.createdAt).toLocaleString()}</td>
              
  <td>
    {o.status !== "shipped" && (
      <button
        className="bg-green-500 text-white px-3 py-1 rounded"
        onClick={async () => {
          await axios.post(`/api/orders/${o.orderId}/ship`);
          fetchOrders();
        }}
      >
        Mark Shipped
      </button>
    )}
  </td>

  <td>
    {o.status === "shipped" && (
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded"
        onClick={async () => {
          await axios.post(`/api/orders/${o.orderId}/deliver`);
          fetchOrders();
        }}
      >
        Mark Delivered
      </button>
    )}
  </td>
</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
