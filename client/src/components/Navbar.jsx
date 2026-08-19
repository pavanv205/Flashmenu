import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#08080A]/90 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white font-sans">
              Flash<span className="gold-gradient-text">Menu</span>
            </span>
            <span className="block text-[10px] text-gray-400 tracking-widest font-bold uppercase -mt-1">
              Scan Tap Dine
            </span>
          </div>
        </Link>

        {/* Center Nav Links - Absolute Dead Center */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-bold text-gray-400 absolute left-1/2 -translate-x-1/2">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            to="/menu/spice-garden"
            className="inline-flex items-center px-3 sm:px-4 py-2 text-xs font-bold text-gray-300 hover:text-white transition-colors"
          >
            Live Demo
          </Link>

          {user ? (
            <Link
              to={user.role === 'admin' ? '/dashboard/admin' : '/dashboard'}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white text-black font-extrabold text-xs transition-all hover:bg-gray-200 shadow-md"
            >
              <LayoutDashboard className="w-4 h-4" />
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
        </div>
      </div>
    </header>
  );
}
