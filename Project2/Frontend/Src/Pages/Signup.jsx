
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const res = await axios.post("/api/auth/signup", { name, email, password });
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Signup failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Signup</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-3"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-3"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-3"
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
        onClick={handleSignup}
      >
        Signup
      </button>
      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  );
}
