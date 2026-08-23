import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FlashLogoBadge from './FlashLogoBadge';

export default function Navbar() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#08080A]/95 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group shrink-0">
          <FlashLogoBadge size="md" className="group-hover:scale-105 transition-transform" />
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white font-sans">
              Flash<span className="gold-gradient-text">Menu</span>
            </span>
            <span className="block text-[10px] text-gray-400 tracking-widest font-bold uppercase -mt-1">
              Scan Tap Dine
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-xs font-bold text-gray-400">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link
            to="/menu/spice-garden"
            className="hidden sm:inline-flex items-center px-3 py-2 text-xs font-bold text-gray-300 hover:text-white transition-colors"
          >
            Live Demo
          </Link>

          <Link
            to="/admin/login"
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-black font-extrabold text-xs transition-all shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Login</span>
          </Link>

          {user ? (
            <Link
              to={user.role === 'admin' ? '/dashboard/admin' : '/dashboard'}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white text-black font-extrabold text-xs transition-all hover:bg-gray-200 shadow-md"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{user.role === 'admin' ? 'Master Admin' : 'Dashboard'}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-2 text-xs font-bold text-gray-300 hover:text-white transition-colors"
            >
              Login
            </Link>
          )}

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0E0E14] border-b border-white/[0.08] px-4 py-4 space-y-3 font-sans">
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-gray-300 hover:text-white">About</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-gray-300 hover:text-white">Features</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-gray-300 hover:text-white">How It Works</a>
          <Link to="/menu/spice-garden" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-gray-300 hover:text-white">Live Demo</Link>
          <div className="pt-2 border-t border-white/[0.08] flex flex-col space-y-2">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-extrabold text-xs flex items-center justify-center space-x-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Login</span>
            </Link>
            {!user && (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-white text-black font-extrabold text-xs"
              >
                Owner Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
