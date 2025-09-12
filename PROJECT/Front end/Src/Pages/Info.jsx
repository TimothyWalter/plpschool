
import React from "react";
import Navbar from "../components/Navbar";

export default function Info() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navbar />
      <div className="max-w-5xl mx-auto p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800">Welcome to FarmCap</h1>
          <p className="mt-3 text-lg text-gray-700">
            FarmCap creates new beginnings for farmers, consumers and traders by modernizing agricultural marketplaces.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-6 items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-green-800">Why FarmCap?</h2>
            <p className="mt-3 text-gray-600">In agriculture there is little competition compared to tech — FarmCap exploits early-stage market opportunity to bring automation, market access and shipment logistics to farmers across Kenya.</p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li>• Marketing for all farm products to industries</li>
              <li>• Nationwide shipments and branch pickup</li>
              <li>• Disease & pest control via local agrovets</li>
              <li>• Advertisement and product promotion</li>
            </ul>
          </div>
          <div className="space-y-4">
            <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1000&q=80" alt="farm" className="rounded-lg shadow-md" />
            <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1000&q=80" alt="market" className="rounded-lg shadow-md" />
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-green-800 mb-3">How it works</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Farmers list raw materials and produce with photos and quantities.</li>
            <li>Buyers browse, order and choose nearest branch for pickup or delivery.</li>
            <li>Payments via M-Pesa or PayPal (sandbox/testing supported).</li>
            <li>SMS & email notifications keep everyone informed at each stage.</li>
          </ol>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-green-800 mb-3">Watch a quick walkthrough</h3>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              title="FarmCap walkthrough"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-96 rounded-lg shadow"
            />
          </div>
          <p className="mt-3 text-sm text-gray-500">Sample demo video — replace with your real marketing video.</p>
        </section>

        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-green-800 mb-3">Market Insights & Analysis</h3>
          <p className="text-gray-700 mb-4">
            The agricultural sector in Kenya is ripe for digital transformation. By building end-to-end supply chains — from farmer to industry — FarmCap reduces friction, increases price discovery and provides predictable logistics.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h4 className="font-semibold text-green-700">Opportunity</h4>
              <p className="text-gray-600">Early movers can capture high-margin B2B contracts with processors and exporters by offering consistent volume and quality.</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h4 className="font-semibold text-green-700">Scale</h4>
              <p className="text-gray-600">Branch network and logistic partners allow FarmCap to scale nationally while keeping delivery times low.</p>
            </div>
          </div>
        </section>

        <footer className="text-center text-gray-600">
          <p>© {new Date().getFullYear()} FarmCap — Original owner: Walter Timothy</p>
        </footer>
      </div>
    </div>
  );
}
