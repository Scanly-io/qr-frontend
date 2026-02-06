import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, AlertCircle, ExternalLink, DollarSign, TrendingUp, Shield } from 'lucide-react';

export default function StripeConnectPage() {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [accountStatus, setAccountStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user already has a connected Stripe account
  React.useEffect(() => {
    checkAccountStatus();
  }, []);

  const checkAccountStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/stripe/connect/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAccountStatus(data);
      }
    } catch (err) {
      console.error('Failed to check account status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectStripe = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/stripe/connect/oauth-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to initiate Stripe Connect');
      }

      const data = await response.json();
      
      // Redirect to Stripe OAuth
      if (data.url) {
        window.location.href = data.url;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to connect Stripe account');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your Stripe account? You will no longer receive payments.')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/stripe/connect/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setAccountStatus(null);
        alert('Stripe account disconnected successfully');
      }
    } catch (err) {
      console.error('Failed to disconnect:', err);
      alert('Failed to disconnect Stripe account');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Stripe Connect
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Accept payments and manage your earnings securely
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {!accountStatus?.connected ? (
            <>
              {/* Benefits Section */}
              <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Why connect Stripe?
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        Get Paid Directly
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Receive 90% of every sale directly to your bank account
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        Secure Payments
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Industry-leading security with PCI compliance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        Track Earnings
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Monitor sales and manage payouts in real-time
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connect Button Section */}
              <div className="p-8">
                {error && (
                  <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={handleConnectStripe}
                    disabled={isConnecting}
                    className="inline-flex items-center gap-2 bg-[#635BFF] hover:bg-[#5851e8] disabled:bg-gray-400 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-lg"
                  >
                    {isConnecting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Connect with Stripe
                        <ExternalLink className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    You'll be redirected to Stripe to securely connect your account
                  </p>
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-gray-50 dark:bg-gray-900/50 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  How it works
                </h3>
                <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">1</span>
                    Click "Connect with Stripe" to begin
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">2</span>
                    Create or log in to your Stripe account
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">3</span>
                    Complete verification (required for payouts)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">4</span>
                    Start accepting payments on your microsite
                  </li>
                </ol>
              </div>
            </>
          ) : (
            <>
              {/* Connected Status */}
              <div className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      Stripe Connected
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your Stripe account is connected and ready to accept payments
                    </p>
                  </div>
                </div>

                {/* Account Details */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 mb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Account ID</p>
                      <p className="font-mono text-sm text-gray-900 dark:text-white">
                        {accountStatus.accountId}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium rounded-full">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => window.open('https://dashboard.stripe.com/', '_blank')}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Open Stripe Dashboard
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/settings')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← Back to Settings
          </button>
        </div>
      </div>
    </div>
  );
}
