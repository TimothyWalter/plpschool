
import { motion } from "framer-motion";

export default function ErrorModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8 max-w-sm text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="mx-auto mb-4 w-16 h-16 border-4 border-red-600 rounded-full flex items-center justify-center text-2xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          ❌
        </motion.div>
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{message || "Something went wrong. Please try again."}</p>
        <button
          onClick={onClose}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}
