import React from 'react';
import { Menu, ExternalLink, QrCode, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function DashboardHeader({ toggleMobileMenu }) {
  const { user, restaurant } = useAuth();

  return (
    <header className="h-16 bg-[#08080A] border-b border-white/[0.08] px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05]"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm font-extrabold text-white hidden sm:block">
            {restaurant ? restaurant.name : 'Dashboard'}
          </h2>
          <p className="text-[11px] text-gray-400">
            {restaurant ? `flashmenu.in/menu/${restaurant.slug}` : 'Manage your digital menu'}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {restaurant && (
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
        </div>
      </div>
    </header>
  );
}
