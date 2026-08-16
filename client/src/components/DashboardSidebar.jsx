import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderTree,
  QrCode,
  BarChart3,
  Store,
  MessageSquare,
  ShoppingBag,
  CreditCard,
  LogOut,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardSidebar({ closeMobileMenu }) {
  const { restaurant, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isBasicPlan = !restaurant?.subscriptionPlan || restaurant?.subscriptionPlan === 'basic' || restaurant?.subscriptionPlan !== 'premium';

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Menu Items', path: '/dashboard/items', icon: UtensilsCrossed },
    { name: 'Categories', path: '/dashboard/categories', icon: FolderTree },
    { name: 'QR Codes', path: '/dashboard/qrcodes', icon: QrCode },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Feedback & Calls', path: '/dashboard/feedback', icon: MessageSquare, badge: isBasicPlan ? 'PRO' : null },
    { name: 'Orders', path: '/dashboard/orders', icon: ShoppingBag, badge: isBasicPlan ? 'PRO' : null },
    { name: 'Profile & Branding', path: '/dashboard/profile', icon: Store },
    { name: 'Subscription', path: '/dashboard/subscription', icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-dark-card border-r border-dark-border flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-6 border-b border-dark-border flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-white tracking-tight">FlashMenu</h1>
            <p className="text-[11px] text-brand-400 font-semibold uppercase tracking-wider">Owner Portal</p>
          </div>
        </div>
      </div>

      {/* Restaurant quick card */}
      {restaurant && (
        <div className="p-4 mx-4 my-4 rounded-xl bg-dark-base border border-dark-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Restaurant</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-sm font-bold text-white truncate">{restaurant.name}</p>
          <a
            href={`/menu/${restaurant.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs text-brand-400 font-medium hover:underline"
          >
            <span>View Public Menu</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-500 text-black font-bold shadow-md shadow-brand-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-dark-hover'
              }`
            }
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <span className="text-[9px] font-black bg-amber-500 text-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-dark-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
