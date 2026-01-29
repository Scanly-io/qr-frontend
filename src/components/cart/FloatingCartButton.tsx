import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';

interface FloatingCartButtonProps {
  onClick: () => void;
  theme?: {
    primaryColor?: string;
    isDark?: boolean;
  };
}

export function FloatingCartButton({ onClick, theme }: FloatingCartButtonProps) {
  const { cartCount, cartTotal } = usePayment();
  const primaryColor = theme?.primaryColor || '#3b82f6';

  if (cartCount === 0) return null;

  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl"
      style={{
        backgroundColor: primaryColor,
        boxShadow: `0 10px 40px ${primaryColor}40`,
      }}
    >
      {/* Cart Icon with Badge */}
      <div className="relative">
        <ShoppingCart className="w-6 h-6 text-white" />
        <AnimatePresence mode="wait">
          <motion.div
            key={cartCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center"
          >
            <span className="text-xs font-bold" style={{ color: primaryColor }}>
              {cartCount}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cart Total */}
      <div className="flex flex-col items-start">
        <span className="text-xs text-white/80 font-medium">Cart</span>
        <span className="text-sm font-bold text-white">
          ${cartTotal.toFixed(2)}
        </span>
      </div>
    </motion.button>
  );
}
