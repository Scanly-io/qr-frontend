import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function PaymentReturnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = React.useState('');
  
  const sessionId = searchParams.get('session_id');

  React.useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setMessage('No session ID provided');
      return;
    }

    // Verify the payment session
    fetch(`${import.meta.env.VITE_API_URL}/stripe/checkout/session/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        console.log('Session data:', data);
        if (data.payment_status === 'paid') {
          setStatus('success');
          setMessage('Payment successful! Your order has been confirmed.');
        } else {
          setStatus('error');
          setMessage('Payment was not completed. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error verifying payment:', error);
        setStatus('error');
        setMessage('Failed to verify payment. Please contact support.');
      });
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        {status === 'loading' && (
          <div className="text-center">
            <Loader2 className="w-16 h-16 mx-auto text-blue-600 animate-spin mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Verifying Payment
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we confirm your payment...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Return to Home
              </button>
              {sessionId && (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Session ID: {sessionId.slice(0, 20)}...
                </p>
              )}
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
