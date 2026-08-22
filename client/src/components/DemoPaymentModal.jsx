import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, CreditCard, Lock, X, Loader2, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../services/api';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function DemoPaymentModal({ isOpen, onClose, planDetails, onSuccess }) {
  const { user, restaurant, updateRestaurantState } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !planDetails) return null;

  const title = planDetails.title || planDetails.planName || 'Restaurant Plan';
  const amount = Number(planDetails.amount ?? planDetails.price ?? 1);
  const duration = planDetails.duration || planDetails.cycleName || 'Monthly';

  const handleRazorpayCheckout = async () => {
    setProcessing(true);
    setError('');

    try {
      // 1. Create Order on Backend via Razorpay API
      const orderRes = await paymentAPI.createOrder({
        amount: planDetails.amount,
        planKey: planDetails.planKey,
        title: planDetails.title,
      });

      if (!orderRes.data || !orderRes.data.orderId) {
        throw new Error('Failed to initiate Razorpay order. Please try again.');
      }

      const { orderId, keyId, amount: razorpayAmount } = orderRes.data;

      // 2. Load Official Razorpay JS SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        throw new Error('Failed to load Razorpay Payment Gateway. Please check your internet connection.');
      }

      const isSelectingLifetime =
        String(planDetails.duration || '').toLowerCase().includes('lifetime') ||
        String(planDetails.title || '').toLowerCase().includes('lifetime');

      // 3. Open Official Razorpay Live Checkout Modal
      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TAwDF3o7rjkreE',
        amount: razorpayAmount,
        currency: 'INR',
        name: 'FlashMenu Solutions',
        description: `${title} Subscription (${duration})`,
        order_id: orderId,
        handler: async function (response) {
          setProcessing(true);
          try {
            const verifyRes = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planKey: planDetails.planKey,
              duration: planDetails.duration,
              title: planDetails.title,
              isLifetime: isSelectingLifetime,
            });

            const updatedRest = verifyRes.data?.restaurant || verifyRes.data;
            if (updatedRest && updateRestaurantState) {
              updateRestaurantState(updatedRest);
            }

            setProcessing(false);
            setCompleted(true);
            setTimeout(async () => {
              setCompleted(false);
              if (onSuccess) {
                await onSuccess(updatedRest || planDetails.planKey);
              }
              onClose();
            }, 1500);
          } catch (vErr) {
            setProcessing(false);
            setError(vErr.response?.data?.message || 'Payment verification failed. Please try again.');
          }
        },
        prefill: {
          name: restaurant?.name || user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#F59E0B',
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setProcessing(false);
        setError(resp.error?.description || 'Payment failed or cancelled.');
      });
      rzp.open();
    } catch (err) {
      setProcessing(false);
      setError(err.response?.data?.message || err.message || 'Payment initiation failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0F172A] border border-amber-500/40 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative text-white">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent p-5 border-b border-dark-border flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Zap className="w-5 h-5 fill-black" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center space-x-1.5">
                <span>FlashMenu Razorpay Gateway</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  LIVE SECURE
                </span>
              </h3>
              <p className="text-[11px] text-gray-400">Official Razorpay Subscription Activation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="w-8 h-8 rounded-full bg-dark-card hover:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {completed ? (
          /* SUCCESS SCREEN */
          <div className="p-8 text-center space-y-4 py-12">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-white">Payment Verified!</h4>
            <p className="text-xs text-gray-300">
              Your <span className="text-amber-400 font-bold">{title}</span> subscription has been activated for{' '}
              <span className="text-white font-bold">{restaurant?.name || 'Your Restaurant'}</span>.
            </p>
          </div>
        ) : (
          /* PAYMENT FORM */
          <div className="p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            {/* Order Summary Box */}
            <div className="p-4 rounded-2xl bg-dark-base border border-dark-border space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Restaurant:</span>
                <span className="font-bold text-white">{restaurant?.name || 'My Restaurant'}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Plan Selected:</span>
                <span className="font-bold text-amber-400">{title}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Validity:</span>
                <span className="font-semibold text-gray-200">{duration}</span>
              </div>
              <div className="pt-2 border-t border-dark-border/60 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300">Total Payable:</span>
                <span className="text-2xl font-black text-amber-400">₹{amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-center">
              <div className="flex items-center justify-center space-x-1.5 text-amber-400 font-bold text-xs">
                <Lock className="w-4 h-4" />
                <span>256-Bit SSL Encrypted Razorpay Checkout</span>
              </div>
              <p className="text-[11px] text-gray-300">
                Supports UPI, Google Pay, PhonePe, Paytm, Credit/Debit Cards & Netbanking.
              </p>
            </div>

            {/* Main Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRazorpayCheckout}
                disabled={processing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Opening Razorpay Secure Checkout...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{amount.toLocaleString()} via Razorpay Live</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
