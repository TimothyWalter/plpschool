
import React, { useState } from "react";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";

export default function Checkout() {
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ items: JSON.parse(localStorage.getItem('cart') || '[]') })
      });
      if (!res.ok) throw new Error("Order failed");
      const data = await res.json();
      setIsSuccessOpen(true);
      // Note: payment confirmation may come via webhook -> frontend listens for 'paymentUpdate'
    } catch (err) {
      console.error("Order failed", err);
      setIsErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>
      <button
        onClick={placeOrder}
        disabled={loading}
        className={`px-6 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>

      <SuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} />
      <ErrorModal isOpen={isErrorOpen} onClose={() => setIsErrorOpen(false)} message="Order failed. Please try again." />
    </div>
  );
}
