import React from 'react';
import { Menu, ExternalLink, QrCode, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function DashboardHeader({ toggleMobileMenu }) {
  const { user, restaurant } = useAuth();

  return (
    <header className="h-16 bg-dark-card border-b border-dark-border px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-hover"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-base font-bold text-white hidden sm:block">
            {restaurant ? restaurant.name : 'Dashboard'}
          </h2>
          <p className="text-xs text-gray-400">
            {restaurant ? `flashmenu.com/menu/${restaurant.slug}` : 'Manage your digital menu'}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {restaurant && (
          <a
            href={`/menu/${restaurant.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-dark-base border border-dark-border text-xs font-semibold text-brand-400 hover:bg-dark-hover transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview Menu</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>
        )}

        <div className="flex items-center space-x-2 pl-3 border-l border-dark-border">
          <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-sm border border-brand-500/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <span className="text-xs font-semibold text-gray-300 hidden md:inline">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}
