/**
 * Simple Stripe Test Page
 * Tests Stripe initialization and basic checkout flow
 */

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3014';

export default function StripeTestPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog(`🔑 Stripe Key: ${STRIPE_KEY ? 'Found (' + STRIPE_KEY.substring(0, 20) + '...)' : 'MISSING'}`);
    addLog(`🌐 API URL: ${API_URL}`);

    if (STRIPE_KEY) {
      loadStripe(STRIPE_KEY)
        .then((stripe) => {
          if (stripe) {
            addLog('✅ Stripe loaded successfully');
            setStripeLoaded(true);
          } else {
            addLog('❌ Stripe failed to load');
          }
        })
        .catch((error) => {
          addLog(`❌ Stripe error: ${error.message}`);
        });
    } else {
      addLog('❌ No Stripe publishable key found in environment');
    }
  }, []);

  const testApiCall = async () => {
    setLoading(true);
    addLog('📡 Testing API call...');

    const url = `${API_URL}/stripe/checkout/create`;
    addLog(`📍 Calling: ${url}`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            name: 'Test Item',
            price: 2500,
            quantity: 1,
            currency: 'USD',
          }],
          metadata: {
            creatorId: 'test-creator',
            micrositeId: 'test-microsite',
          },
          uiMode: 'embedded',
          returnUrl: `${window.location.origin}/payment/success`,
        }),
      });

      addLog(`📥 Response status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        addLog(`✅ Success! Got client secret: ${data.clientSecret ? 'Yes' : 'No'}`);
        if (data.clientSecret) {
          addLog(`🔐 Client secret: ${data.clientSecret.substring(0, 30)}...`);
        }
      } else {
        const errorText = await response.text();
        addLog(`❌ Error response: ${errorText}`);
      }
    } catch (error) {
      addLog(`❌ Fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6">🧪 Stripe Integration Test</h1>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${STRIPE_KEY ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium">Stripe Publishable Key: {STRIPE_KEY ? 'Found' : 'Missing'}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${stripeLoaded ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="font-medium">Stripe SDK: {stripeLoaded ? 'Loaded' : 'Loading...'}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="font-medium">API URL: {API_URL}</span>
            </div>
          </div>

          <button
            onClick={testApiCall}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? 'Testing...' : '🧪 Test API Call'}
          </button>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">📋 Console Logs</h2>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500">No logs yet...</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="mb-1">{log}</div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
