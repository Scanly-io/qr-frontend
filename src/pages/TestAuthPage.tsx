/**
 * Test Authentication Page
 * Quick test to verify API integration works
 */

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function TestAuthPage() {
  const { user, accessToken, login, logout, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      alert('Login successful!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold">🧪 Auth Test Page</h1>

        {/* Auth Status */}
        <div className="p-4 bg-card border border-border rounded-lg">
          <h2 className="font-semibold mb-2">Authentication Status:</h2>
          <p className="text-sm">
            <span className="font-medium">Status:</span>{' '}
            <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
              {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
            </span>
          </p>
          {user && (
            <>
              <p className="text-sm mt-2">
                <span className="font-medium">User ID:</span> {user.id}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {user.email}
              </p>
            </>
          )}
          {accessToken && (
            <p className="text-sm mt-2">
              <span className="font-medium">Token:</span>{' '}
              <span className="font-mono text-xs break-all">{accessToken.substring(0, 50)}...</span>
            </p>
          )}
        </div>

        {/* Login Form */}
        {!isAuthenticated && (
          <div className="p-4 bg-card border border-border rounded-lg space-y-4">
            <h2 className="font-semibold">Login Form:</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded bg-background"
                placeholder="test@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded bg-background"
                placeholder="password123"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50 font-medium"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        )}

        {/* Logout Button */}
        {isAuthenticated && (
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:opacity-90 font-medium"
          >
            Logout
          </button>
        )}

        {/* Test Info */}
        <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
          <h3 className="font-semibold">Test Credentials:</h3>
          <p>Email: test@example.com</p>
          <p>Password: password123</p>
          <p className="text-xs text-muted-foreground mt-3">
            This user was created via curl command. The backend is running on localhost.
          </p>
        </div>
      </div>
    </div>
  );
}
