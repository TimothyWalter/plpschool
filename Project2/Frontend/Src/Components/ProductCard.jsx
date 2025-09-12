
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  return (
    <motion.div
      className="border rounded-lg p-4 shadow-md bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded" />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <p className="text-gray-600">KES {product.price}</p>
      <button className="mt-3 bg-green-600 text-white px-4 py-2 rounded">Add to Cart</button>
    </motion.div>
  );
}
