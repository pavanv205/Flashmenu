import React, { useState } from 'react';
import { ShieldCheck, Mail, KeyRound, ArrowRight, X, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import FlashLogoBadge from './FlashLogoBadge';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminBypassModal({ isOpen, onClose, targetPlan, onSuccess }) {
  const { updateRestaurantState } = useAuth();
  const [step, setStep] = useState(1); // 1 = Admin Email, 2 = 6-digit OTP Code
  const [adminEmail, setAdminEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!adminEmail) {
      setError('Please enter Admin email address');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await authAPI.sendAdminBypassOTP({ email: adminEmail });
      setMessage(res.data?.message || '2FA code sent to Admin email address');
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to send Admin 2FA code.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setError('Please enter valid 6-digit security code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authAPI.verifyAdminBypassOTP({
        email: adminEmail,
        otpCode,
        planKey: targetPlan?.planKey || 'premium',
        duration: targetPlan?.duration || 'lifetime',
      });

      const updatedRest = res.data?.restaurant;
      if (updatedRest && updateRestaurantState) {
        updateRestaurantState(updatedRest);
      }

      setMessage('Admin 2FA Verified! Account unlocked successfully without payment.');
      setTimeout(async () => {
        if (onSuccess) {
          await onSuccess(updatedRest);
        }
        onClose();
      }, 1200);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Verification failed. Invalid or expired code.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="bg-[#0E0E14] border border-amber-500/40 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative text-white space-y-6 p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <ShieldCheck className="w-7 h-7 text-amber-400" />
          </div>
          <h3 className="text-xl font-extrabold text-white">Admin 2FA Account Bypass</h3>
          <p className="text-xs text-gray-400">
            {step === 1
              ? 'Secret 5-Tap detected. Enter Admin Email to receive 2FA security code.'
              : `Enter 6-digit 2FA code sent to ${adminEmail}`}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* STEP 1: Enter Admin Email */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Admin Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="admin@flashmenu.in"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#08080A] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending 2FA Security Code...</span>
                </>
              ) : (
                <>
                  <span>Send 2FA Security Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Enter 6-Digit 2FA Code */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                6-Digit 2FA Code *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="e.g. 123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#08080A] border border-amber-500/40 text-amber-400 text-center font-mono text-lg font-black tracking-widest focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-black text-xs transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying 2FA & Activating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify 2FA & Unlock Account</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs text-gray-400 hover:text-white transition-colors underline pt-1"
            >
              Use a different Admin Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
