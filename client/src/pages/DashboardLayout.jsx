import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';

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

  const isLifetime = restaurant?.subscriptionCycle === 'lifetime';
  const expiresAtDate = restaurant?.subscriptionExpiresAt ? new Date(restaurant.subscriptionExpiresAt) : null;
  const isExpired = !isLifetime && expiresAtDate && expiresAtDate.getTime() <= Date.now();

  // If subscription is EXPIRED, redirect any non-subscription dashboard route to /dashboard/subscription!
  if (isExpired && location.pathname !== '/dashboard/subscription') {
    return <Navigate to="/dashboard/subscription" replace />;
  }

  return (
    <div className="min-h-screen bg-[#08080A] flex overflow-hidden font-sans">
      {/* Desktop Sidebar (Only shown if NOT expired) */}
      {!isExpired && (
        <div className="hidden lg:block">
          <DashboardSidebar />
        </div>
      )}

      {/* Mobile Drawer Overlay */}
      {!isExpired && mobileMenuOpen && (
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
        <DashboardHeader
          toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          isExpiredPaywall={isExpired}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
