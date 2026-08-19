import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, ShieldCheck, Store, KeyRound, Loader2, CheckCircle2 } from 'lucide-react';
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

  // Master Admin 2FA State
  const [step2FA, setStep2FA] = useState(false);
  const [adminEmail2FA, setAdminEmail2FA] = useState('');
  const [adminOtp, setAdminOtp] = useState('');
  const [success2FAMsg, setSuccess2FAMsg] = useState('');

  const { user, login, verifyAdmin2FA } = useAuth();
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
    setStep2FA(false);
    if (role === 'admin') {
      setEmail('pavanvadapalli26@gmail.com');
      setPassword('');
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
      if (resData?.requires2FA) {
        setStep2FA(true);
        setAdminEmail2FA(resData.email || email);
        setSuccess2FAMsg(resData.message || 'Security confirmation code sent to pavanvadapalli26@gmail.com!');
      } else if (resData?.role === 'admin') {
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

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resData = await verifyAdmin2FA(adminEmail2FA, adminOtp);
      if (resData?.role === 'admin') {
        navigate('/dashboard/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid 2FA verification code. Please check your email inbox.');
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
            {step2FA
              ? 'Master Admin Security 2FA'
              : activeRole === 'admin'
              ? 'Master Admin Control Sign In'
              : 'Welcome Back'}
          </h2>
          <p className="text-xs text-gray-400">
            {step2FA
              ? 'Enter the 6-digit confirmation code sent to your email to gain access'
              : activeRole === 'admin'
              ? 'Platform Administrator Portal & Customer Controls'
              : 'Sign in to manage your digital restaurant menu'}
          </p>
        </div>

        {/* Role Toggle Switcher (Hidden in 2FA mode) */}
        {!step2FA && (
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
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {step2FA ? (
          /* STEP 2: MASTER ADMIN 2FA VERIFICATION CODE FORM */
          <form onSubmit={handleVerify2FA} className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1.5">
              <CheckCircle2 className="w-6 h-6 text-amber-400 mx-auto" />
              <p className="text-xs text-gray-200">{success2FAMsg}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                6-Digit Confirmation Code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={adminOtp}
                  onChange={(e) => setAdminOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-base border border-amber-500/50 text-amber-400 text-sm font-mono tracking-widest font-black focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify & Grant Admin Access</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setStep2FA(false)}
                className="text-xs text-gray-400 hover:text-white font-semibold transition-colors"
              >
                &larr; Back to Admin Sign In
              </button>
            </div>
          </form>
        ) : (
          /* STEP 1: LOGIN CREDENTIALS FORM */
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
                  placeholder={activeRole === 'admin' ? 'pavanvadapalli26@gmail.com' : 'owner@restaurant.com'}
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
                {activeRole !== 'admin' && (
                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                )}
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
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking Credentials...</span>
                </>
              ) : (
                <>
                  <span>{activeRole === 'admin' ? 'Login as Master Admin' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
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
