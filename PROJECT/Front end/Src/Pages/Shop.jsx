
import React from "react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";

export default function Shop() {
  const { addToCart } = useCart();

  const products = [
    { id: 1, name: "Maize", price: 200 },
    { id: 2, name: "Fertilizer", price: 500 },
    { id: 3, name: "Beans", price: 300 },
  ];

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {products.map((p) => (
          <div key={p.id} className="p-4 bg-white rounded shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="text-gray-700">KES {p.price}</p>
            <button
              onClick={() => addToCart(p)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
            >
              Add to Basket
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
