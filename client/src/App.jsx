import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PublicMenuPage from './pages/PublicMenuPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

import DashboardLayout from './pages/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import MenuItemsPage from './pages/MenuItemsPage';
import CategoriesPage from './pages/CategoriesPage';
import QRCodesPage from './pages/QRCodesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import FeedbackPage from './pages/FeedbackPage';
import OrdersPage from './pages/OrdersPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import SubscriptionPage from './pages/SubscriptionPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import WhatsAppButton from './components/WhatsAppButton';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<LoginPage initialRole="admin" />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/menu/:restaurantSlug" element={<PublicMenuPage />} />

        {/* Dashboard Protected Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="items" element={<MenuItemsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="qrcodes" element={<QRCodesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="order-history" element={<OrderHistoryPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
        </Route>
      </Routes>
      <WhatsAppButton />
    </AuthProvider>
  );
}
