import { usePayment } from '@/contexts/PaymentContext';
import { motion } from 'framer-motion';

export default function PaymentTestPage() {
  const { quickPurchase, isCheckoutLoading, checkoutError, isCheckoutOpen } = usePayment();

  const handleTestPurchase = async () => {
    await quickPurchase(
      {
        id: 'test-artwork-1',
        type: 'artwork',
        name: 'Test Artwork - Abstract Dreams',
        price: 2500,
        currency: 'USD',
        description: 'Oil on Canvas • 24" x 36"',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
        metadata: {
          artistName: 'Test Artist',
          medium: 'Oil on Canvas',
          dimensions: '24" x 36"',
        },
      },
      {
        creatorId: 'test-creator-123',
        micrositeId: 'test-microsite-456',
        artistName: 'Test Artist',
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Stripe Payment Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Test the embedded Stripe checkout flow
          </p>

          {/* Test Product Card */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-8">
            <div className="flex gap-6">
              <img
                src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600"
                alt="Test Artwork"
                className="w-32 h-32 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Abstract Dreams
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Oil on Canvas • 24" x 36"
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    $2,500
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <motion.button
            onClick={handleTestPurchase}
            disabled={isCheckoutLoading || isCheckoutOpen}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isCheckoutLoading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Opening Checkout...
              </span>
            ) : isCheckoutOpen ? (
              'Checkout Open'
            ) : (
              '🎨 Purchase Artwork - $2,500'
            )}
          </motion.button>

          {/* Error Display */}
          {checkoutError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 dark:text-red-200">Error</h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">{checkoutError}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Info Box */}
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              ℹ️ How This Works
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <li>• Click the button to test the Stripe embedded checkout</li>
              <li>• A modal will appear with the Stripe payment form</li>
              <li>• You'll see card input fields, address, etc.</li>
              <li>• The backend API endpoint needs to be created first</li>
              <li>• Expected error: "Failed to create checkout session" (normal - no backend yet)</li>
            </ul>
          </div>

          {/* Status Indicators */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Checkout Status</div>
              <div className={`font-semibold mt-1 ${isCheckoutOpen ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                {isCheckoutOpen ? '✓ Open' : '○ Closed'}
              </div>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Loading State</div>
              <div className={`font-semibold mt-1 ${isCheckoutLoading ? 'text-yellow-600' : 'text-gray-900 dark:text-white'}`}>
                {isCheckoutLoading ? '⏳ Loading' : '○ Idle'}
              </div>
            </div>
          </div>

          {/* Backend Setup Link */}
          <div className="mt-8 text-center">
            <a
              href="/STRIPE_CONNECT_IMPLEMENTATION.md"
              target="_blank"
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              📖 View Backend Setup Guide →
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
