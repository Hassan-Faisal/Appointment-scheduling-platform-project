import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function SlotButton({ time, available, onClick, loading = false }) {
  const disabled = !available || loading;

  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.04 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      onClick={!disabled ? onClick : undefined}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2
        ${
          available
            ? "bg-green-600 text-white hover:bg-green-700 shadow-sm"
            : "bg-gray-400 text-white cursor-not-allowed"
        }
        ${loading ? "opacity-70" : ""}
      `}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {time}
    </motion.button>
  );
}
