import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, KeyRound, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FlashLogoBadge from '../components/FlashLogoBadge';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resData = await login(email.trim().toLowerCase(), password);
      if (resData?.requires2FA) {
        setStep2FA(true);
        setAdminEmail2FA(resData.email || email);
        setSuccess2FAMsg(resData.message || 'Step 2: Enter the 6-digit 2FA security code sent to your email inbox');
      } else if (resData?.role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
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
      navigate('/dashboard/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid 2FA verification code. Please check your email inbox.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080A] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#0E0E14] border border-white/[0.08] rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-3">
            <FlashLogoBadge size="lg" />
            <span className="font-extrabold text-2xl text-white">
              Flash<span className="gold-gradient-text">Menu</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white pt-2">
            {step2FA ? 'Step 2: Enter 2FA Code' : 'Step 1: Account Login'}
          </h2>
          <p className="text-xs text-gray-400">
            {step2FA
              ? 'Enter your 6-digit security code to complete Step 2 and open Master Admin Dashboard'
              : 'Log in with your credentials to access your dashboard'}
          </p>
        </div>

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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                  6-Digit 2FA Code
                </label>
                <button
                  type="button"
                  onClick={async () => {
                    setError('');
                    setLoading(true);
                    try {
                      const resData = await login('pavanvadapalli205@gmail.com', 'Pavan@2193');
                      setSuccess2FAMsg(resData.message || 'New 2FA verification code sent to pavanvadapalli205@gmail.com!');
                    } catch (err) {
                      setError(err.response?.data?.message || 'Failed to resend code');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50 underline"
                >
                  Resend 2FA Code
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={adminOtp}
                  onChange={(e) => setAdminOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#08080A] border border-amber-500/50 text-amber-400 text-sm font-mono tracking-widest font-black focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Step 3: Opening Master Admin Dashboard...</span>
                </>
              ) : (
                <>
                  <span>Step 3: Verify & Open Master Admin Dashboard</span>
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
                &larr; Back to Login
              </button>
            </div>
          </form>
        ) : (
          /* STEP 1: SINGLE UNIFIED LOGIN CREDENTIALS FORM */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="owner@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#08080A] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#08080A] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-amber-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white transition-colors"
                  title={showPassword ? 'Hide password' : 'View password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-white text-black hover:bg-gray-200 font-extrabold text-sm transition-all shadow-md disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging In...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
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
