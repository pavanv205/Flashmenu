import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';
import SubscriptionPage from './SubscriptionPage';

export default function DashboardLayout() {
  const { user, restaurant, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const [now, setNow] = React.useState(Date.now());

  const isAdminRoute = location.pathname.startsWith('/dashboard/admin');

  const isAdminUser =
    isAdminRoute ||
    user?.role === 'admin' ||
    String(user?.email || '').toLowerCase().trim() === 'pavanvadapalli205@gmail.com';

  const isLifetime = restaurant?.subscriptionCycle === 'lifetime';
  const expiresAtMs = restaurant?.subscriptionExpiresAt ? new Date(restaurant.subscriptionExpiresAt).getTime() : 0;
  const isExpired = !isAdminUser && !isLifetime && expiresAtMs > 0 && expiresAtMs <= now;
  const isUnpaid = !isAdminUser && (!restaurant || restaurant.isActive === false || !restaurant.subscriptionStartDate);

  React.useEffect(() => {
    if (isAdminUser || isLifetime || !restaurant?.subscriptionExpiresAt) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isAdminUser, isLifetime, restaurant?.subscriptionExpiresAt]);

  // If subscription is EXPIRED or UNPAID (and user is NOT an Admin): lock screen to full-page Paywall!
  if (!isAdminUser && (isExpired || isUnpaid)) {
    return (
      <div className="min-h-screen bg-[#08080A] flex flex-col font-sans">
        <DashboardHeader isExpiredPaywall={true} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <SubscriptionPage isExpiredPaywall={true} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080A] flex overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 max-w-xs w-full bg-dark-card z-10">
            <DashboardSidebar closeMobileMenu={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
