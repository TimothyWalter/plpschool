
import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full p-6">
      <motion.div
        className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
}
