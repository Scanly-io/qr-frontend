import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EditorPage from '@/pages/EditorPage';
import DashboardPage from '@/pages/DashboardPageSimple';
import AnalyticsDashboardPage from '@/pages/AnalyticsDashboardPageNew.tsx';
import TemplateGalleryPage from '@/pages/TemplateGalleryPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import TestAuthPage from '@/pages/TestAuthPage';
import { SettingsPage } from '@/pages/SettingsPage';
import AgencyManagementPage from '@/pages/AgencyManagementPage';
import MLTestPage from '@/pages/MLTestPage';
import AccessibilityScannerPage from '@/pages/AccessibilityScannerPage';
import UTMBuilderPage from '@/pages/UTMBuilderPage';
import PaymentTestPage from '@/pages/PaymentTestPage';
import StripeTestPage from '@/pages/StripeTestPage';
import PaymentReturnPage from '@/pages/PaymentReturnPage';
import StripeConnectPage from '@/pages/StripeConnectPage';
import PaymentHistoryPage from '@/pages/PaymentHistoryPage';
import PublicMicrositePage from '@/pages/PublicMicrositePage';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { CartWidget } from '@/components/ui/CartWidget';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function App() {
  return (
    <PaymentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Public Microsite — React-rendered, no auth */}
          <Route path="/public/:slug" element={<PublicMicrositePage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/templates" element={<ProtectedRoute><TemplateGalleryPage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboardPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
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
        <CartWidget />
      </BrowserRouter>
    </PaymentProvider>
  );
}

export default App;
