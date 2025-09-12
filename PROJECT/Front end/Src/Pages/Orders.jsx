
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    // setup socket
    const socket = io();
    socket.on('connect', () => console.log('socket connected', socket.id));
    socket.on('paymentUpdate', (data) => {
      setOrders((prev) => prev.map(o => o._id === data.orderId ? { ...o, paymentStatus: data.status, status: data.status === 'success' ? 'Paid' : o.status } : o));
    });
    socket.on('order.updated', (data) => {
      setOrders((prev) => prev.map(o => o._id === data.orderId ? { ...o, status: data.status } : o));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>
      <ul className="space-y-2">
        {orders.map((o) => (
          <li key={o._id} className="border p-4 rounded shadow">
            <p>Order ID: {o._id}</p>
            <p>Status: {o.status}</p>
            <p>Payment: {o.paymentStatus}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
