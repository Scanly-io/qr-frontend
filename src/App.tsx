import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { CartWidget } from '@/components/ui/CartWidget';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Eager load critical pages (login/signup)
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';

// Lazy load everything else
const EditorPage = lazy(() => import('@/pages/EditorPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPageSimple'));
const AnalyticsDashboardPage = lazy(() => import('@/pages/AnalyticsDashboardPageNew.tsx'));
const TemplateGalleryPage = lazy(() => import('@/pages/TemplateGalleryPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const AgencyManagementPage = lazy(() => import('@/pages/AgencyManagementPage'));
const MLTestPage = lazy(() => import('@/pages/MLTestPage'));
const AccessibilityScannerPage = lazy(() => import('@/pages/AccessibilityScannerPage'));
const UTMBuilderPage = lazy(() => import('@/pages/UTMBuilderPage'));
const PaymentTestPage = lazy(() => import('@/pages/PaymentTestPage'));
const StripeTestPage = lazy(() => import('@/pages/StripeTestPage'));
const PaymentReturnPage = lazy(() => import('@/pages/PaymentReturnPage'));
const StripeConnectPage = lazy(() => import('@/pages/StripeConnectPage'));
const PaymentHistoryPage = lazy(() => import('@/pages/PaymentHistoryPage'));
const PublicMicrositePage = lazy(() => import('@/pages/PublicMicrositePage'));
const TestAuthPage = lazy(() => import('@/pages/TestAuthPage'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <PaymentProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Public Microsite — React-rendered, no auth */}
            <Route path="/public/:slug" element={<PublicMicrositePage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/templates" element={<ProtectedRoute><TemplateGalleryPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboardPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
            <Route path="/agency" element={<ProtectedRoute><AgencyManagementPage /></ProtectedRoute>} />
            <Route path="/editor/:id" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
            <Route path="/payment/history" element={<ProtectedRoute><PaymentHistoryPage /></ProtectedRoute>} />
            <Route path="/stripe/connect" element={<ProtectedRoute><StripeConnectPage /></ProtectedRoute>} />
            
            {/* Test/Dev Pages - Not protected for testing */}
            <Route path="/ml-test" element={<MLTestPage />} />
            <Route path="/accessibility" element={<AccessibilityScannerPage />} />
            <Route path="/utm-builder" element={<UTMBuilderPage />} />
            <Route path="/payment-test" element={<PaymentTestPage />} />
            <Route path="/stripe-test" element={<StripeTestPage />} />
            <Route path="/payment/return" element={<PaymentReturnPage />} />
            <Route path="/test-auth" element={<TestAuthPage />} />
          </Routes>
        </Suspense>
        <CartWidget />
      </BrowserRouter>
    </PaymentProvider>
  );
}

export default App;
