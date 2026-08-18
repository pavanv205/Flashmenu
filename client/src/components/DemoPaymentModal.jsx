import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, QrCode, CreditCard, Building2, Lock, X, Loader2, Zap } from 'lucide-react';
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
  const { user, restaurant } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // razorpay, upi, card
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !planDetails) return null;

  const handleRazorpayCheckout = async () => {
    setProcessing(true);
    setError('');

    try {
      // 1. Create order on backend
      const orderRes = await paymentAPI.createOrder({
        amount: planDetails.amount,
        planKey: planDetails.planKey,
        title: planDetails.title,
      });

      const { orderId, amount, currency, keyId } = orderRes.data || {};

      // 2. Load Razorpay JS SDK
      const isLoaded = await loadRazorpayScript();

      if (isLoaded && window.Razorpay) {
        const options = {
          key: keyId || 'rzp_test_1234567890',
          amount: amount,
          currency: currency || 'INR',
          name: 'FlashMenu Gateway',
          description: `${planDetails.title} Subscription (${planDetails.duration})`,
          order_id: orderId,
          handler: async function (response) {
            try {
              // 3. Verify Payment Signature
              await paymentAPI.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planKey: planDetails.planKey,
              });

              setProcessing(false);
              setCompleted(true);
              setTimeout(async () => {
                setCompleted(false);
                if (onSuccess) {
                  await onSuccess(planDetails.planKey);
                }
                onClose();
              }, 1500);
            } catch (verifyErr) {
              setProcessing(false);
              setError('Payment verification failed. Please try again.');
            }
          },
          prefill: {
            name: restaurant?.name || user?.name || '',
            email: user?.email || '',
            contact: user?.phone || '',
          },
          notes: {
            planKey: planDetails.planKey,
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
        rzp.open();
      } else {
        // Fallback to embedded demo payment processing
        await handleSimulatePayment();
      }
    } catch (err) {
      console.warn('Razorpay order creation fallback:', err);
      // Fallback to direct verification simulation
      await handleSimulatePayment();
    }
  };

  const handleSimulatePayment = async () => {
    setProcessing(true);
    setTimeout(async () => {
      try {
        await paymentAPI.verifyPayment({
          razorpay_order_id: `order_demo_${Date.now()}`,
          razorpay_payment_id: `pay_demo_${Date.now()}`,
          razorpay_signature: `sig_demo_${Date.now()}`,
          planKey: planDetails.planKey,
        });

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
        setError('Payment processing error. Please try again.');
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0F172A] border border-amber-500/40 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative text-white">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent p-5 border-b border-dark-border flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black">
              <Zap className="w-5 h-5 fill-black" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center space-x-1.5">
                <span>Razorpay Gateway</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  RAZORPAY SECURE
                </span>
              </h3>
              <p className="text-[11px] text-gray-400">FlashMenu Subscription Activation</p>
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
                <span>Restaurant Name:</span>
                <span className="font-bold text-white">{restaurant?.name || 'My Restaurant'}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Selected Plan:</span>
                <span className="font-bold text-amber-400">{planDetails.title}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Billing Period:</span>
                <span className="font-semibold text-gray-200">{planDetails.duration}</span>
              </div>
              <div className="pt-2 border-t border-dark-border/60 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300">Total Amount:</span>
                <span className="text-2xl font-black text-amber-400">₹{planDetails.amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                    paymentMethod === 'razorpay'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-400 shadow-md'
                      : 'bg-dark-base border-dark-border text-gray-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Razorpay Popup</span>
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
                  <span>UPI / QR</span>
                </button>
              </div>
            </div>

            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-dark-base border border-dark-border text-center space-y-2">
                <div className="w-24 h-24 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-inner">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=flashmenu.pay@upi%26pn=FlashMenu%26am=${planDetails.amount}`}
                    alt="Razorpay UPI QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[11px] text-gray-400">Scan with GPay, PhonePe or Paytm</p>
                <div className="inline-block px-3 py-1 rounded-full bg-gray-800 text-[11px] font-mono text-amber-400">
                  flashmenu.pay@upi
                </div>
              </div>
            )}

            {/* Main Checkout Button */}
            <div className="pt-2">
              <button
                onClick={paymentMethod === 'razorpay' ? handleRazorpayCheckout : handleSimulatePayment}
                disabled={processing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Launching Razorpay Gateway...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{planDetails.amount.toLocaleString()} via Razorpay</span>
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
