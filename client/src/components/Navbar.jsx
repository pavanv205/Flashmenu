import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, restaurant } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-6 h-6 text-black fill-black" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight text-white font-sans">
              Flash<span className="gold-gradient-text">Menu</span>
            </span>
            <span className="block text-[10px] text-gray-400 tracking-wider font-semibold uppercase -mt-1">
              Scan. See. Dine.
            </span>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            to="/menu/spice-garden"
            className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-300 hover:text-brand-400 transition-colors"
          >
            Live Demo
          </Link>

          {user ? (
            <Link
              to={user.role === 'admin' ? '/dashboard/admin' : '/dashboard'}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-bold text-sm transition-all shadow-md shadow-brand-500/20"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{user.role === 'admin' ? 'Master Admin' : 'Dashboard'}</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login?role=admin"
                className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>
              <Link
                to="/login"
                className="px-3.5 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 hover:from-brand-400 hover:to-brand-300 text-black font-bold text-sm transition-all shadow-lg shadow-brand-500/20 hover:scale-[1.02]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
