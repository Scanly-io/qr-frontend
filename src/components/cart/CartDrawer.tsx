import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  theme?: {
    primaryColor?: string;
    isDark?: boolean;
  };
}

export function CartDrawer({ isOpen, onClose, onCheckout, theme }: CartDrawerProps) {
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart } = usePayment();
  const primaryColor = theme?.primaryColor || '#3b82f6';
  const isDark = theme?.isDark || false;

  const bgColor = isDark ? '#18181b' : '#ffffff';
  const borderColor = isDark ? '#27272a' : '#e5e7eb';
  const titleColor = isDark ? '#fafafa' : '#18181b';
  const bodyColor = isDark ? '#a1a1aa' : '#6b7280';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[70] shadow-2xl flex flex-col"
            style={{ backgroundColor: bgColor }}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor }}
            >
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: titleColor }}>
                  <ShoppingBag className="w-5 h-5" />
                  Your Cart
                </h2>
                <p className="text-sm mt-1" style={{ color: bodyColor }}>
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors"
                style={{ 
                  backgroundColor: isDark ? '#27272a' : '#f3f4f6',
                  color: bodyColor 
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 mb-4" style={{ color: bodyColor, opacity: 0.3 }} />
                  <p className="text-lg font-semibold mb-2" style={{ color: titleColor }}>
                    Your cart is empty
                  </p>
                  <p className="text-sm" style={{ color: bodyColor }}>
                    Add items to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-4 rounded-xl border"
                      style={{ 
                        backgroundColor: isDark ? '#27272a' : '#f9fafb',
                        borderColor 
                      }}
                    >
                      {/* Item Image */}
                      {item.image && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 truncate" style={{ color: titleColor }}>
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-sm mb-2 line-clamp-2" style={{ color: bodyColor }}>
                            {item.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded transition-colors"
                              style={{ 
                                backgroundColor: isDark ? '#3f3f46' : '#e5e7eb',
                                color: titleColor 
                              }}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium" style={{ color: titleColor }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded transition-colors"
                              style={{ 
                                backgroundColor: isDark ? '#3f3f46' : '#e5e7eb',
                                color: titleColor 
                              }}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="font-bold" style={{ color: primaryColor }}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-xs" style={{ color: bodyColor }}>
                                ${item.price.toFixed(2)} each
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="mt-2 text-xs flex items-center gap-1 transition-colors"
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Total & Checkout */}
            {cart.length > 0 && (
              <div 
                className="border-t px-6 py-4 space-y-4"
                style={{ borderColor }}
              >
                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold" style={{ color: titleColor }}>
                    Subtotal
                  </span>
                  <span className="font-bold text-2xl" style={{ color: primaryColor }}>
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <motion.button
                  onClick={onCheckout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg"
                  style={{ 
                    backgroundColor: primaryColor,
                    boxShadow: `0 4px 20px ${primaryColor}40`
                  }}
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                </motion.button>

                {/* Security Notice */}
                <p className="text-xs text-center" style={{ color: bodyColor }}>
                  Secure checkout powered by Stripe
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
