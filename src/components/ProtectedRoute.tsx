import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component that guards routes requiring authentication
 * 
 * Simple token check - doesn't validate with backend on mount.
 * Backend validation happens naturally when components make API calls.
 * 
 * Usage:
 * <Route path="/dashboard" element={
 *   <ProtectedRoute><DashboardPage /></ProtectedRoute>
 * } />
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const storeToken = accessToken;
    const localToken = localStorage.getItem('accessToken');
    const hasToken = storeToken || localToken;
    
    if (!hasToken) {
      navigate('/login', { replace: true });
    }
  }, [accessToken, navigate]);

  // Only render children if we have a token
  const hasToken = accessToken || localStorage.getItem('accessToken');
  return hasToken ? <>{children}</> : null;
}
