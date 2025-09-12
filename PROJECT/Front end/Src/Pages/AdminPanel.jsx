
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function AdminPanel() {
  const role = localStorage.getItem("role");
  const [users, setUsers] = useState([]);

  if (role !== "admin") {
    return <Navigate to="/login" />;
  }

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (id, newRole) => {
    await fetch(`http://localhost:5000/api/users/${id}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ role: newRole }),
    });
    fetchUsers();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">User ID</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border p-2">{user._id}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                    onClick={() => changeRole(user._id, "customer")}
                  >
                    Customer
                  </button>
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded"
                    onClick={() => changeRole(user._id, "trader")}
                  >
                    Trader
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => changeRole(user._id, "admin")}
                  >
                    Admin
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
