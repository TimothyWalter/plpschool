
import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { ShoppingCart, CreditCard, Truck, CheckCircle } from "lucide-react";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(()=>{
    const s = io(); // connects to same host
    setSocket(s);
    s.on('connect', ()=> console.log('socket connected', s.id));
    return ()=> { s.disconnect(); };
  }, []);

  useEffect(()=>{
    if (!socket || !orderId) return;
    socket.emit('joinOrderRoom', orderId);
    socket.on('order.updated', (data)=>{
      if (data.orderId === orderId) {
        setStatus({ orderId: data.orderId, status: data.status, placedAt: data.order?.createdAt });
      }
    });
    return ()=> {
      socket.off('order.updated');
    };
  }, [socket, orderId]);

  const trackOrder = async () => {
    try {
      const res = await axios.get(`/api/orders/${orderId}/status`);
      setStatus(res.data);
      setError("");
      // join room for realtime updates
      if (socket) socket.emit('joinOrderRoom', orderId);
    } catch (err) {
      setError("Order not found");
      setStatus(null);
    }
  };

  const stages = [
    { key: "placed", label: "Placed", icon: <ShoppingCart /> },
    { key: "paid", label: "Paid", icon: <CreditCard /> },
    { key: "shipped", label: "Shipped", icon: <Truck /> },
    { key: "delivered", label: "Delivered", icon: <CheckCircle /> },
  ];
  const currentIndex = status ? stages.findIndex(s => s.key === status.status) : -1;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Track Your Order</h2>
      <input
        type="text"
        placeholder="Enter Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-3"
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
        onClick={trackOrder}
      >
        Track Order
      </button>

      {status && (
        <div className="mt-6">
          <p className="mb-3"><strong>Order ID:</strong> {status.orderId}</p>
          <div className="flex justify-between mb-4 text-sm font-medium">
            {stages.map((stage, i) => (
              <div key={stage.key} className="flex flex-col items-center w-1/4">
                <div
                  className={`p-2 rounded-full ${i <= currentIndex ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"}`}
                >
                  {stage.icon}
                </div>
                <span className={`mt-1 text-xs ${i <= currentIndex ? "text-green-600" : "text-gray-400"}`}>
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / stages.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  );
}
