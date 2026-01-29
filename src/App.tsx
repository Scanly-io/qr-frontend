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
import { PaymentProvider } from '@/contexts/PaymentContext';
import { CartWidget } from '@/components/ui/CartWidget';

function App() {
  return (
    <PaymentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/templates" element={<TemplateGalleryPage />} />
          <Route path="/analytics" element={<AnalyticsDashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/agency" element={<AgencyManagementPage />} />
          <Route path="/ml-test" element={<MLTestPage />} />
          <Route path="/accessibility" element={<AccessibilityScannerPage />} />
          <Route path="/utm-builder" element={<UTMBuilderPage />} />
          <Route path="/payment-test" element={<PaymentTestPage />} />
          <Route path="/stripe-test" element={<StripeTestPage />} />
          <Route path="/payment/return" element={<PaymentReturnPage />} />
          <Route path="/payment/history" element={<PaymentHistoryPage />} />
          <Route path="/stripe/connect" element={<StripeConnectPage />} />
          <Route path="/editor/:id" element={<EditorPage />} />
          <Route path="/test-auth" element={<TestAuthPage />} />
        </Routes>
        <CartWidget />
      </BrowserRouter>
    </PaymentProvider>
  );
}

export default App;
