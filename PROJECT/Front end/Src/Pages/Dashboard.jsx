
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const features = [
    { title: "Market Products", desc: "Sell your farm products easily to industries and customers.", icon: "🌱" },
    { title: "Shipments", desc: "Fast, reliable deliveries across the country.", icon: "🚚" },
    { title: "Disease Control", desc: "Connect with Agro vets for pest & disease management.", icon: "🐄" },
    { title: "Advertisements", desc: "Promote your farm products for better visibility.", icon: "📢" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <Navbar />
      <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl font-bold text-green-800"
        >
          Welcome, {user?.name || "Farmer"} 👋
        </motion.h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Features */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-green-700 text-center mb-12"
      >
        FarmCap is here to modernize your farming experience.
      </motion.p>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2, duration: 0.8 }}
            className="bg-white shadow-xl rounded-2xl p-6 text-center hover:shadow-2xl transform hover:-translate-y-2 transition"
          >
            <div className="text-5xl mb-4">{f.icon}</div>
            <h2 className="text-2xl font-bold text-green-800">{f.title}</h2>
            <p className="text-gray-600 mt-2">{f.desc}</p>
          </motion.div>
        ))}
      </div>
          </div>
    </div>
  );
}
