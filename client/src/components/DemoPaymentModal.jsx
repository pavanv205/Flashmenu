import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, QrCode, CreditCard, Building2, Lock, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DemoPaymentModal({ isOpen, onClose, planDetails, onSuccess }) {
  const { restaurant } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi, card, netbanking
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!isOpen || !planDetails) return null;

  const handleSimulatePayment = async () => {
    setProcessing(true);
    // Simulate network delay for demo payment gateway
    setTimeout(async () => {
      setProcessing(false);
      setCompleted(true);
      setTimeout(async () => {
        setCompleted(false);
        if (onSuccess) {
          await onSuccess(planDetails.planKey);
        }
        onClose();
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0F172A] border border-amber-500/40 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative text-white">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent p-5 border-b border-dark-border flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center space-x-1.5">
                <span>Demo Payment Gateway</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  TEST MODE
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
            <h4 className="text-2xl font-black text-white">Payment Successful!</h4>
            <p className="text-xs text-gray-300">
              Your <span className="text-amber-400 font-bold">{planDetails.title}</span> has been activated for{' '}
              <span className="text-white font-bold">{restaurant?.name || 'Your Restaurant'}</span>.
            </p>
          </div>
        ) : (
          /* PAYMENT FORM */
          <div className="p-6 space-y-5">
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
                <span className="text-xs font-bold text-gray-300">Total Payable:</span>
                <span className="text-2xl font-black text-emerald-400">₹{planDetails.amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                Select Demo Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                    paymentMethod === 'upi'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-dark-base border-dark-border text-gray-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                    paymentMethod === 'card'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-dark-base border-dark-border text-gray-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                    paymentMethod === 'netbanking'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-dark-base border-dark-border text-gray-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Net Banking</span>
                </button>
              </div>
            </div>

            {/* Payment Details View */}
            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-dark-base border border-dark-border text-center space-y-2">
                <div className="w-24 h-24 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-inner">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=flashmenu.pay@upi%26pn=FlashMenu%26am=${planDetails.amount}`}
                    alt="Demo UPI QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[11px] text-gray-400">Scan with GPay, PhonePe or Paytm</p>
                <div className="inline-block px-3 py-1 rounded-full bg-gray-800 text-[11px] font-mono text-amber-400">
                  flashmenu.pay@upi
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-dark-base border border-dark-border space-y-3">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Demo Card Number</label>
                  <input
                    type="text"
                    readOnly
                    value="4111 •••• •••• 1111"
                    className="w-full bg-dark-card border border-dark-border rounded-xl px-3 py-2 text-xs font-mono text-white mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-semibold">Expiry</label>
                    <input
                      type="text"
                      readOnly
                      value="12/28"
                      className="w-full bg-dark-card border border-dark-border rounded-xl px-3 py-2 text-xs font-mono text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-semibold">CVV</label>
                    <input
                      type="text"
                      readOnly
                      value="123"
                      className="w-full bg-dark-card border border-dark-border rounded-xl px-3 py-2 text-xs font-mono text-white mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="p-4 rounded-2xl bg-dark-base border border-dark-border text-center space-y-2">
                <p className="text-xs text-gray-300 font-medium">Select Demo Bank</p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2 bg-dark-card rounded-xl text-[11px] font-bold text-amber-400 border border-amber-500/30">
                    HDFC Bank
                  </div>
                  <div className="p-2 bg-dark-card rounded-xl text-[11px] font-bold text-gray-300 border border-dark-border">
                    SBI Bank
                  </div>
                  <div className="p-2 bg-dark-card rounded-xl text-[11px] font-bold text-gray-300 border border-dark-border">
                    ICICI Bank
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                onClick={handleSimulatePayment}
                disabled={processing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-black text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Demo Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Complete Demo Payment (₹{planDetails.amount.toLocaleString()})</span>
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
