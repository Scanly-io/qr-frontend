/**
 * Cart Widget - Floating cart button with item count
 * 
 * Shows current cart status and opens cart drawer
 */

import { ShoppingCart, X, Trash2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { usePayment } from '@/contexts/PaymentContext';
import { motion, AnimatePresence } from 'framer-motion';

export function CartWidget() {
  const {
    cart,
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    initiateCheckout,
    isCheckoutLoading,
  } = usePayment();

  const [isOpen, setIsOpen] = useState(false);

  // Don't show if cart is empty
  if (cartCount === 0) return null;

  const handleCheckout = async () => {
    // Get creator ID from first item's metadata
    const creatorId = cart[0]?.metadata?.creatorId as string;
    const micrositeId = cart[0]?.metadata?.micrositeId as string;

    if (!creatorId) {
      console.error('No creator ID found in cart items');
      return;
    }

    await initiateCheckout({
      creatorId,
      micrositeId,
    });
  };

  return (
    <>
      {/* Floating Cart Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-black dark:bg-white text-white dark:text-black rounded-full p-4 shadow-2xl hover:scale-105 transition-transform"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </div>
      </motion.button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Your Cart
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {cartCount} {cartCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                  >
                    {/* Image */}
                    {item.image && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      
                      {/* Type badge */}
                      <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        {item.type}
                      </span>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      {item.quantity > 1 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          ${item.price.toFixed(2)} each
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-gray-800 p-6 space-y-4 bg-gray-50 dark:bg-gray-800">
                {/* Total */}
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-gray-900 dark:text-white">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckoutLoading}
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCheckoutLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full"
                        />
                        Processing...
                      </span>
                    ) : (
                      'Checkout'
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Clear all items from cart?')) {
                        clearCart();
                        setIsOpen(false);
                      }
                    }}
                    className="w-full text-red-500 dark:text-red-400 py-3 rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>

                {/* Secure checkout badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-8-4zm0 18c-4.41-1.05-7-5.49-7-9.5V7.3l7-3.5 7 3.5v3.2c0 4.01-2.59 8.45-7 9.5z"/>
                  </svg>
                  Secured by Stripe
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
