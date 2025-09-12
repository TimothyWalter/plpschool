
import React, { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Basket() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [message, setMessage] = useState("");

  const subtotal = cart.reduce((s, it) => s + it.price * it.quantity, 0);

  const handleCheckout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ items: cart }),
      });

      if (!res.ok) throw new Error("Checkout failed");
      const data = await res.json();

      setMessage(`✅ Order #${data._id} placed successfully!`);
      clearCart();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to place order");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Your Basket</h2>
      {cart.length === 0 ? (
        <p className="text-gray-600">No items in basket</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-4">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between py-2 items-center">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">KES {item.price * item.quantity}</div>
                  <button
                    className="text-sm text-red-600 mt-1"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mb-3">
            <div className="text-gray-700 font-semibold">Subtotal</div>
            <div className="font-bold">KES {subtotal}</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCheckout}
              className="flex-1 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
            >
              Proceed to Checkout
            </button>
          </div>
          {message && <p className="mt-3 text-sm">{message}</p>}
        </>
      )}
    </div>
  );
}
