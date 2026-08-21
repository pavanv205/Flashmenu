import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, KeyRound, Loader2 } from 'lucide-react';
import { authAPI } from '../services/api';
import FlashLogoBadge from '../components/FlashLogoBadge';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await authAPI.forgotPassword({ email: email.trim().toLowerCase() });
      setSuccessMsg(res.data?.message || 'Password reset code has been sent to your email address!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md bg-dark-card border border-dark-border rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-3">
            <FlashLogoBadge size="lg" />
            <span className="font-extrabold text-2xl text-white">
              Flash<span className="gold-gradient-text">Menu</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white pt-2 flex items-center justify-center space-x-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <span>Forgot Password?</span>
          </h2>
          <p className="text-xs text-gray-400">
            Enter your account email to receive a 6-digit verification code.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {successMsg ? (
          <div className="space-y-5 text-center py-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">Reset Code Sent!</h3>
              <p className="text-xs text-gray-300">
                A 6-digit security verification code has been sent directly to{' '}
                <span className="text-amber-400 font-bold">{email}</span>. Please check your inbox or spam folder.
              </p>
            </div>

            <button
              onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2"
            >
              <span>Enter Code & Set New Password</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Account Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="owner@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  <span>Sending Code via Email...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-dark-border/60">
          <Link to="/login" className="text-xs text-gray-400 hover:text-white font-semibold transition-colors">
            &larr; Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
