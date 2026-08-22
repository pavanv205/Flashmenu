import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
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
  ShieldCheck,
  History,
} from 'lucide-react';
import FlashLogoBadge from './FlashLogoBadge';
import { useAuth } from '../context/AuthContext';

export default function DashboardSidebar({ closeMobileMenu }) {
  const { user, restaurant, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isBasicPlan = !restaurant?.subscriptionPlan || restaurant?.subscriptionPlan === 'basic' || restaurant?.subscriptionPlan !== 'premium';

  const baseItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Menu Items', path: '/dashboard/items', icon: UtensilsCrossed },
    { name: 'Categories', path: '/dashboard/categories', icon: FolderTree },
    { name: 'QR Codes', path: '/dashboard/qrcodes', icon: QrCode },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Feedback & Calls', path: '/dashboard/feedback', icon: MessageSquare, badge: isBasicPlan ? 'PRO' : null },
    { name: 'Orders', path: '/dashboard/orders', icon: ShoppingBag, badge: isBasicPlan ? 'PRO' : null },
    { name: 'Order History', path: '/dashboard/order-history', icon: History, badge: isBasicPlan ? 'PRO' : null },
    { name: 'Profile & Branding', path: '/dashboard/profile', icon: Store },
    { name: 'Subscription', path: '/dashboard/subscription', icon: CreditCard },
  ];

  const navItems =
    user?.role === 'admin'
      ? [{ name: 'Master Admin Panel', path: '/dashboard/admin', icon: ShieldCheck, badge: 'SUPER' }, ...baseItems]
      : baseItems;

  return (
    <aside className="w-64 bg-[#08080A] border-r border-white/[0.08] flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center space-x-3 group">
          <FlashLogoBadge size="md" className="group-hover:scale-105 transition-transform" />
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white font-sans">
              Flash<span className="gold-gradient-text">Menu</span>
            </span>
            <span className="block text-[10px] text-gray-400 tracking-widest font-bold uppercase -mt-1">
              Owner Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Restaurant quick card */}
      {restaurant && restaurant.name && restaurant.slug && (
        <div className="p-4 mx-4 my-4 rounded-2xl bg-[#0E0E14] border border-white/[0.07] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Restaurant</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-xs font-extrabold text-white truncate">{restaurant.name}</p>
          <a
            href={`/menu/${restaurant.slug}?preview=true`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-[11px] text-amber-400 font-bold hover:underline"
          >
            <span>View Public Menu</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-amber-500 text-black font-extrabold shadow-lg shadow-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
              }`
            }
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <span className="text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.5 rounded uppercase tracking-wider">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-white/[0.08]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
