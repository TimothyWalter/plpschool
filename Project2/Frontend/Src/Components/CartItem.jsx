
import { motion } from "framer-motion";

export default function CartItem({ item }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="flex justify-between items-center border-b py-2"
    >
      <span>{item.name}</span>
      <span>KES {item.price}</span>
    </motion.div>
  );
}
