import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FlashLogoBadge from '../components/FlashLogoBadge';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step2FA, setStep2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAEmail, setTwoFAEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const { user, login, verifyAdmin2FA } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResendLogin2FA = async () => {
    if (resendCooldown > 0 || resendLoading) return;
    setError('');
    setSuccessMsg('');
    setResendLoading(true);
    try {
      const targetEmail = twoFAEmail || email.trim().toLowerCase();
      const resData = await login(targetEmail, password);
      setSuccessMsg(resData?.message || 'Fresh 2FA Security Code sent to your email!');
      setResendCooldown(30);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend 2FA Security Code.');
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const resData = await login(email.trim().toLowerCase(), password);
      if (resData?.requires2FA) {
        setStep2FA(true);
        setTwoFAEmail(resData.email || email.trim().toLowerCase());
        setSuccessMsg(resData.message || '2FA Security Code sent to registered email.');
        return;
      }
      if (resData?.role === 'admin') {
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
      const resData = await verifyAdmin2FA(twoFAEmail || email.trim().toLowerCase(), twoFACode.trim());
      if (resData?.role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid 2FA security verification code.');
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
          <h2 className="text-xl font-bold text-white pt-2">Welcome Back</h2>
          <p className="text-xs text-gray-400">Log in to manage your digital restaurant menu</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold text-center">
            {successMsg}
          </div>
        )}

        {step2FA ? (
          <form onSubmit={handleVerify2FA} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Enter 2FA Security Code
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-amber-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="6-Digit Security Code"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#08080A] border border-amber-500/50 text-amber-400 text-base font-mono font-black tracking-widest text-center focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-[11px] text-gray-400">Sent to <span className="text-amber-400 font-bold">{twoFAEmail}</span></span>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || resendLoading}
                  onClick={handleResendLogin2FA}
                  className="text-xs text-amber-400 font-bold hover:underline disabled:opacity-50 disabled:no-underline flex items-center space-x-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`} />
                  <span>
                    {resendLoading
                      ? 'Resending...'
                      : resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : 'Resend Code'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying 2FA Code...</span>
                </>
              ) : (
                <>
                  <span>Verify Code & Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep2FA(false);
                setError('');
                setSuccessMsg('');
              }}
              className="w-full py-2.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Credentials Login
            </button>
          </form>
        ) : (
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
