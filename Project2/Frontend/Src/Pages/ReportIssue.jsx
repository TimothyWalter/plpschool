
import React, { useState } from "react";

export default function ReportIssue() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/support/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("✅ Issue reported successfully! We'll reach out soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } else {
      setStatus("❌ Failed to send issue. Please try again later.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Report an Issue</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Your Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="message"
          placeholder="Describe your issue..."
          value={form.message}
          onChange={handleChange}
          className="w-full border p-2 rounded h-28"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      {status && <p className="mt-4">{status}</p>}

      <div className="mt-6">
        <p className="font-semibold">📞 Call us directly:</p>
        <p>+254 700 123 456</p>
      </div>
    </div>
  );
}
