import React from 'react';
import { CreditCard, Lock } from 'lucide-react';

interface MockCheckoutProps {
  amount: number;
  currency?: string;
  itemName: string;
  onClose?: () => void;
}

/**
 * Mock Checkout Component
 * Used for preview/demo purposes - shows what the checkout will look like
 * without actually processing payments
 */
export function MockCheckout({ amount, currency = 'USD', itemName, onClose }: MockCheckoutProps) {
  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-gray-900 md:bg-black/80 md:backdrop-blur-sm animate-in fade-in duration-200">
      <div className="h-full md:flex md:items-center md:justify-center md:p-4">
        <div className="relative h-full w-full md:max-w-md md:max-h-[85vh] bg-white dark:bg-gray-900 md:rounded-3xl md:shadow-2xl flex flex-col overflow-hidden md:border md:border-gray-200 md:dark:border-gray-800">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 md:py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
            <div className="flex-1">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Checkout</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <svg className="w-3 h-3 text-[#635BFF]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 1.352 0 2.482.616 2.482.616l.869-2.653s-.976-.616-3.301-.616c-2.951 0-5.002 1.565-5.002 3.758 0 1.993 1.778 2.987 3.524 3.793 1.778.806 2.378 1.426 2.378 2.409 0 .938-.739 1.565-2.172 1.565-1.901 0-3.524-.869-3.524-.869l-.869 2.653s1.515.869 3.919.869c3.058 0 5.131-1.565 5.131-3.869 0-2.047-1.778-3.087-3.524-3.942z"/>
                </svg>
                <span className="text-xs text-gray-500 dark:text-gray-400">Secure payment</span>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2.5 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close preview"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Preview Badge */}
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900">
            <p className="text-xs text-blue-700 dark:text-blue-300 text-center font-medium">
              ✨ Preview Mode - This is how your checkout will look
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            
            {/* Order Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Order Summary</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{itemName}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${amount.toFixed(2)} {currency}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="text-base font-semibold text-gray-900 dark:text-white">
                    ${amount.toFixed(2)} {currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Payment method</label>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium">
                  <CreditCard className="w-4 h-4" />
                  Card
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"/>
                  </svg>
                  Pay
                </button>
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Card number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 cursor-not-allowed opacity-60"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    <div className="w-8 h-5 bg-gradient-to-br from-blue-600 to-blue-400 rounded"></div>
                    <div className="w-8 h-5 bg-gradient-to-br from-red-600 to-orange-400 rounded"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 cursor-not-allowed opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 cursor-not-allowed opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cardholder name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 cursor-not-allowed opacity-60"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 cursor-not-allowed opacity-60"
                />
              </div>
            </div>

            {/* Pay Button */}
            <button
              disabled
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
            >
              <Lock className="w-4 h-4" />
              Pay ${amount.toFixed(2)}
            </button>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400 py-2">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-green-600" />
                <span>Secure</span>
              </div>
              <span>•</span>
              <span>Powered by Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
