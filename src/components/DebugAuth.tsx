import { useAuthStore } from '@/store/authStore';

export function DebugAuth() {
  const { isAuthenticated, user, accessToken } = useAuthStore();

  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      background: 'rgba(0,0,0,0.9)',
      color: '#0f0',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '11px',
      fontFamily: 'monospace',
      maxWidth: '300px',
      zIndex: 9999,
    }}>
      <div><strong>Auth Debug:</strong></div>
      <div>Authenticated: {isAuthenticated ? '✅ YES' : '❌ NO'}</div>
      <div>User: {user?.email || 'None'}</div>
      <div>Token: {accessToken ? `${accessToken.slice(0, 20)}...` : 'None'}</div>
      <div>localStorage.accessToken: {localStorage.getItem('accessToken') ? '✅' : '❌'}</div>
    </div>
  );
}
