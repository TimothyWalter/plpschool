
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import TraderSuccessModal from "../components/TraderSuccessModal";
import ErrorModal from "../components/ErrorModal";

export default function TraderDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("http://localhost:5000/api/trader/orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error loading trader orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/trader/orders/${orderId}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Update failed");
      setIsSuccessOpen(true);
    } catch (err) {
      console.error("Failed to update order", err);
      setIsErrorOpen(true);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Trader Dashboard</h2>
      <ul className="space-y-2">
        {orders.map((o) => (
          <li key={o.id} className="border p-4 rounded shadow">
            <p>Order ID: {o.id}</p>
            <p>Status: {o.status}</p>
            <button
              onClick={() => updateOrderStatus(o.id)}
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
            >
              Update Status
            </button>
          </li>
        ))}
      </ul>

      <TraderSuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} />
      <ErrorModal isOpen={isErrorOpen} onClose={() => setIsErrorOpen(false)} message="Order update failed." />
    </div>
  );
}
