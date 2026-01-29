/**
 * Shopping Cart Component
 * 
 * Displays cart items with ability to update quantities and checkout
 */

import React from 'react';
import { X, ShoppingBag, CreditCard, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePayment } from '@/contexts/PaymentContext';
import { formatCurrency } from '@/lib/payment-utils';
import { StripeIcon } from '@/components/icons/BrandIcons';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  micrositeId?: string;
  creatorId: string;
}

export function CartDrawer({ isOpen, onClose, micrositeId, creatorId }: CartDrawerProps) {
  const {
    cart,
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    initiateCheckout,
    isCheckoutLoading,
    checkoutError,
  } = usePayment();

  const handleCheckout = async () => {
    await initiateCheckout({
      creatorId,
      micrositeId,
      successUrl: `${window.location.origin}/payment/success`,
      cancelUrl: window.location.href,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-lg font-semibold">
                  Cart {cartCount > 0 && `(${cartCount})`}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
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
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    >
                      {/* Item Image */}
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="text-lg font-semibold">
                            {formatCurrency(item.price, item.currency)}
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 ml-auto">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              +
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t dark:border-gray-800 p-4 space-y-4">
                {/* Clear Cart */}
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Clear cart
                </button>

                {/* Total */}
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>

                {/* Error Message */}
                {checkoutError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                    {checkoutError}
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckoutLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckoutLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Checkout
                    </>
                  )}
                </button>

                {/* Stripe Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Secured by</span>
                  <StripeIcon className="w-10 h-4" />
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
