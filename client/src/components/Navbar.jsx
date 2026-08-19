import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#090C10]/85 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight text-white font-sans">
              Flash<span className="gold-gradient-text">Menu</span>
            </span>
            <span className="block text-[10px] text-gray-400 tracking-widest font-bold uppercase -mt-1">
              Scan Tap Dine
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-bold text-gray-400">
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            to="/menu/spice-garden"
            className="hidden sm:inline-flex items-center px-4 py-2 text-xs font-bold text-gray-300 hover:text-amber-400 transition-colors"
          >
            Live Demo
          </Link>

          {user ? (
            <Link
              to={user.role === 'admin' ? '/dashboard/admin' : '/dashboard'}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{user.role === 'admin' ? 'Master Admin' : 'Dashboard'}</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login?role=admin"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs font-bold text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
