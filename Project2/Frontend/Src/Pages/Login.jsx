
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Login</h2>
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
        onClick={handleLogin}
      >
        Login
      </button>
      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  );
}
