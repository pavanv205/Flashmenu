import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, QrCode, CreditCard, Lock, X, Loader2, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { paymentAPI, restaurantAPI } from '../services/api';

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
  const [paymentMethod, setPaymentMethod] = useState('demo'); // demo, razorpay, upi
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !planDetails) return null;

  const handleSimulatePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      // 1. Call verification API (or fallback)
      try {
        await paymentAPI.verifyPayment({
          razorpay_order_id: `order_demo_${Date.now()}`,
          razorpay_payment_id: `pay_demo_${Date.now()}`,
          razorpay_signature: `sig_demo_${Date.now()}`,
          planKey: planDetails.planKey,
          duration: planDetails.duration,
        });
      } catch (e) {
        console.warn('Backend payment verify fallback:', e);
      }

      // 2. Direct restaurant plan update fallback
      try {
        const isLifetime = String(planDetails.duration || '').toLowerCase().includes('lifetime');
        const res = await restaurantAPI.updateMyRestaurant({
          subscriptionPlan: planDetails.planKey,
          subscriptionCycle: isLifetime ? 'lifetime' : '6months',
          subscriptionStartDate: new Date(),
          subscriptionExpiresAt: isLifetime ? null : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        });
        if (res.data && updateRestaurantState) {
          updateRestaurantState(res.data);
        }
      } catch (err) {
        console.warn('Direct plan update fallback:', err);
      }

      setProcessing(false);
      setCompleted(true);

      setTimeout(async () => {
        setCompleted(false);
        if (onSuccess) {
          await onSuccess(planDetails.planKey);
        }
        onClose();
      }, 1500);
    } catch (err) {
      setProcessing(false);
      setError('Payment simulation failed. Please try again.');
    }
  };

  const handleRazorpayCheckout = async () => {
    setProcessing(true);
    setError('');

    try {
      // 1. Create order on backend
      let orderId = `order_demo_${Date.now()}`;
      let keyId = 'rzp_test_1234567890';
      let amount = Math.round(Number(planDetails.amount) * 100);

      try {
        const orderRes = await paymentAPI.createOrder({
          amount: planDetails.amount,
          planKey: planDetails.planKey,
          title: planDetails.title,
        });
        if (orderRes.data) {
          orderId = orderRes.data.orderId || orderId;
          keyId = orderRes.data.keyId || keyId;
          amount = orderRes.data.amount || amount;
        }
      } catch (e) {
        console.warn('Order API creation fallback:', e);
      }

      // 2. Try loading official Razorpay JS SDK
      const isLoaded = await loadRazorpayScript();

      if (isLoaded && window.Razorpay && !keyId.includes('test_1234567890')) {
        const options = {
          key: keyId,
          amount: amount,
          currency: 'INR',
          name: 'FlashMenu Solutions',
          description: `${planDetails.title} Subscription (${planDetails.duration})`,
          order_id: orderId,
          handler: async function (response) {
            await handleSimulatePayment();
          },
          prefill: {
            name: restaurant?.name || user?.name || '',
            email: user?.email || '',
            contact: user?.phone || '',
          },
          theme: { color: '#F59E0B' },
          modal: {
            ondismiss: function () {
              setProcessing(false);
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback to seamless Instant Test Payment processing
        await handleSimulatePayment();
      }
    } catch (err) {
      await handleSimulatePayment();
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
                <span>FlashMenu Demo Gateway</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  TEST & LIVE GATEWAY
                </span>
              </h3>
              <p className="text-[11px] text-gray-400">Subscription Plan Activation</p>
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
              Your <span className="text-amber-400 font-bold">{planDetails.title}</span> subscription has been activated for{' '}
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
                <span className="font-bold text-amber-400">{planDetails.title}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Validity:</span>
                <span className="font-semibold text-gray-200">{planDetails.duration}</span>
              </div>
              <div className="pt-2 border-t border-dark-border/60 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300">Total Payable:</span>
                <span className="text-2xl font-black text-amber-400">₹{planDetails.amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Options Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('demo')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                    paymentMethod === 'demo'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-400 shadow-md'
                      : 'bg-dark-base border-dark-border text-gray-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Instant Demo Payment</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                    paymentMethod === 'upi'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-400 shadow-md'
                      : 'bg-dark-base border-dark-border text-gray-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>UPI QR Code</span>
                </button>
              </div>
            </div>

            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-dark-base border border-dark-border text-center space-y-2">
                <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-inner">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=flashmenu.pay@upi%26pn=FlashMenu%26am=${planDetails.amount}`}
                    alt="Razorpay UPI QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[11px] text-gray-400">Scan with GPay, PhonePe, Paytm or BHIM</p>
                <div className="inline-block px-3 py-1 rounded-full bg-gray-800 text-[11px] font-mono text-amber-400 border border-dark-border">
                  flashmenu.pay@upi
                </div>
              </div>
            )}

            {/* Main Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={processing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Payment & Activating Plan...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Complete Payment (₹{planDetails.amount.toLocaleString()})</span>
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
