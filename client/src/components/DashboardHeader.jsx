import React from 'react';
import { Menu, ExternalLink, QrCode, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import FlashLogoBadge from './FlashLogoBadge';

export default function DashboardHeader({ toggleMobileMenu, isExpiredPaywall }) {
  const { user, restaurant, logout } = useAuth();
  const isAdmin =
    user?.role === 'admin' ||
    ['flashmenu18@gmail.com', 'pavanvadapalli205@gmail.com', 'admin@flashmenu.in', 'pava26@gmail.com'].includes(
      String(user?.email || '').toLowerCase()
    );

  return (
    <header className="h-16 bg-[#08080A] border-b border-white/[0.08] px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {!isExpiredPaywall && (
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05]"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center space-x-3">
          <FlashLogoBadge size="sm" />
          <div>
            <h2 className="text-sm font-extrabold text-white flex items-center space-x-1.5">
              <span>{isAdmin ? 'FlashMenu System Headquarters' : restaurant?.name ? restaurant.name : 'FlashMenu'}</span>
            </h2>
            <p className="text-[11px] text-gray-400 font-semibold">
              {isAdmin ? 'FlashMenu Master Admin Control Center' : restaurant?.slug ? `flashmenu.in/menu/${restaurant.slug}` : 'FlashMenu Owner Portal'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {isAdmin && (
          <Link
            to="/dashboard/admin"
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-xs font-black text-amber-400 hover:bg-amber-500 hover:text-black transition-all shadow-md"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Master Admin Portal</span>
          </Link>
        )}

        {restaurant?.slug && !isExpiredPaywall && (
          <a
            href={`/menu/${restaurant.slug}?preview=true`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0E0E14] border border-white/[0.08] text-xs font-bold text-amber-400 hover:border-amber-500/50 transition-all"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview Menu</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        )}

        <div className="flex items-center space-x-2 pl-3 border-l border-white/[0.08]">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-extrabold text-xs border border-amber-500/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <span className="text-xs font-bold text-gray-300 hidden md:inline">{user?.name}</span>
          {isExpiredPaywall && (
            <button
              onClick={logout}
              className="ml-2 text-xs font-semibold text-gray-400 hover:text-red-400 transition-colors underline"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
