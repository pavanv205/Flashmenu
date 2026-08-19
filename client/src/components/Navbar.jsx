import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, LayoutDashboard, ShieldCheck, ArrowRight, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#060709]/85 backdrop-blur-xl border-b border-indigo-500/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                Flash<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-amber-400">Menu</span>
              </span>
              <span className="text-[9px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full flex items-center space-x-1">
                <Bot className="w-2.5 h-2.5 text-indigo-400" />
                <span>STITCH AI</span>
              </span>
            </div>
            <span className="block text-[10px] text-gray-400 tracking-wider font-semibold uppercase -mt-0.5">
              Scan Tap Dine
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-gray-300">
          <a href="#ai-generator" className="hover:text-indigo-400 transition-colors flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Studio</span>
          </a>
          <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">Workflow</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            to="/menu/spice-garden"
            className="hidden sm:inline-flex items-center text-xs font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Live Demo
          </Link>

          {user ? (
            <Link
              to={user.role === 'admin' ? '/dashboard/admin' : '/dashboard'}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold text-xs transition-all hover:opacity-90 shadow-lg shadow-indigo-500/25"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{user.role === 'admin' ? 'Master Admin' : 'Dashboard'}</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login?role=admin"
                className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-400 hover:bg-amber-500/20 transition-all"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Admin Login</span>
              </Link>
              <Link
                to="/login"
                className="px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 text-white font-extrabold text-xs transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/20"
              >
                <span>Launch AI Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
