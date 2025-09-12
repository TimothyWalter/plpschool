
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-green-700 text-white p-4 flex justify-between relative">
      <h1 className="text-xl font-bold">FarmCap</h1>
      <ul className="flex space-x-6 items-center">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/orders">Orders</Link></li>

        {/* Customer Service dropdown with animation */}
        <li className="relative">
          <button
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            Customer Service ▾
          </button>

          <AnimatePresence>
            {open && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 bg-white text-black mt-2 rounded shadow-md w-48 z-50"
              >
                <li className="px-4 py-2 hover:bg-gray-200">
                  <Link to="/report" onClick={() => setOpen(false)}>Report Issue</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-200">
                  <a href="tel:+254700123456" onClick={() => setOpen(false)}>Call Us</a>
                </li>
                <li className="px-4 py-2 hover:bg-gray-200">
                  <a href="mailto:support@yourdomain.com" onClick={() => setOpen(false)}>Email Us</a>
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
        </li>
      </ul>
    </nav>
  );
}
