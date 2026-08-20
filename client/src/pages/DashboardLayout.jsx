import React, { useState } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';

export default function DashboardLayout() {
  const { user, restaurant, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        {/* Subscription Expired Alert Banner (Top of Dashboard Pages) */}
        {isExpired && (
          <div className="bg-red-950/90 border-b border-red-500/50 px-4 py-3 text-center flex items-center justify-between text-xs text-red-200 shadow-xl z-20 shrink-0">
            <div className="flex items-center space-x-2.5 mx-auto">
              <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce shrink-0" />
              <span>
                <strong>Your Subscription Plan Has Expired!</strong> Customer QR menu ordering is currently locked. Please renew or upgrade your plan to restore full services.
              </span>
            </div>
            <Link
              to="/dashboard/subscription"
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-extrabold text-xs transition-all shrink-0 ml-3 flex items-center space-x-1 shadow-md shadow-red-500/20"
            >
              <span>Renew / Upgrade Plan →</span>
            </Link>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
