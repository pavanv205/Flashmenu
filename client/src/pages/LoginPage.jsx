import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, ShieldCheck, Store, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ initialRole }) {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');

  const [activeRole, setActiveRole] = useState(
    initialRole === 'admin' || roleParam === 'admin' ? 'admin' : 'owner'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleRoleSwitch = (role) => {
    setActiveRole(role);
    setError('');
    if (role === 'admin') {
      setEmail('admin@flashmenu.com');
      setPassword('admin123');
    } else {
      setEmail('');
      setPassword('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resData = await login(email.trim().toLowerCase(), password);
      if (resData.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md bg-dark-card border border-dark-border rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Zap className="w-6 h-6 text-black fill-black" />
            </div>
            <span className="font-extrabold text-2xl text-white">
              Flash<span className="gold-gradient-text">Menu</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white pt-2">
            {activeRole === 'admin' ? 'Master Admin Control Sign In' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-gray-400">
            {activeRole === 'admin'
              ? 'Platform Administrator Portal & Customer Controls'
              : 'Sign in to manage your digital restaurant menu'}
          </p>
        </div>

        {/* Role Toggle Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-dark-base border border-dark-border rounded-2xl">
          <button
            type="button"
            onClick={() => handleRoleSwitch('owner')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeRole === 'owner'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Restaurant Owner</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSwitch('admin')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeRole === 'admin'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Master Admin</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder={activeRole === 'admin' ? 'admin@flashmenu.com' : 'owner@restaurant.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Signing in...' : activeRole === 'admin' ? 'Login as Master Admin' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Admin Quick Credentials Hint */}
        {activeRole === 'admin' ? (
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-center space-y-1">
            <p className="text-[11px] font-black text-amber-400 uppercase tracking-wider">Master Admin Credentials</p>
            <p className="text-xs text-gray-300">
              Email: <span className="font-mono text-white">admin@flashmenu.com</span>
            </p>
            <p className="text-xs text-gray-300">
              Password: <span className="font-mono text-white">admin123</span>
            </p>
          </div>
        ) : (
          <div className="p-3 bg-dark-base rounded-xl border border-dark-border text-center space-y-1">
            <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Demo Credentials</p>
            <p className="text-xs text-gray-300">
              Email: <span className="font-mono text-white">demo@flashmenu.com</span>
            </p>
            <p className="text-xs text-gray-300">
              Password: <span className="font-mono text-white">password123</span>
            </p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pt-2">
          Don't have a FlashMenu account?{' '}
          <Link to="/signup" className="text-amber-400 font-bold hover:underline">
            Register Restaurant
          </Link>
        </p>
      </div>
    </div>
  );
}
