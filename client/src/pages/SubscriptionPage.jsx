import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { restaurantAPI } from '../services/api';
import { Check, Sparkles, Zap, Crown, Store, CreditCard } from 'lucide-react';
import DemoPaymentModal from '../components/DemoPaymentModal';

export default function SubscriptionPage() {
  const { restaurant, updateRestaurantState } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState('');
  const [demoPaymentModal, setDemoPaymentModal] = useState({ isOpen: false, planDetails: null });

  const currentPlan = restaurant?.subscriptionPlan || 'basic';

  const handleSelectPlan = async (planKey) => {
    setLoadingPlan(planKey);
    try {
      const res = await restaurantAPI.updateMyRestaurant({ subscriptionPlan: planKey });
      if (res.data) {
        updateRestaurantState(res.data);
      }
    } catch (error) {
      console.error('Failed to change subscription plan:', error);
      alert('Failed to update plan. Please try again.');
    } finally {
      setLoadingPlan('');
    }
  };

  const openDemoPayment = (planKey, title, duration, amount) => {
    setDemoPaymentModal({
      isOpen: true,
      planDetails: { planKey, title, duration, amount },
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Subscription & Plan Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Select or upgrade your FlashMenu tier for your restaurant (<span className="text-amber-400 font-bold">{restaurant?.name || 'My Restaurant'}</span>)
        </p>
      </div>

      {/* 2 Restaurant Plans Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* CARD 1: BASIC RESTAURANT */}
        <div
          className={`relative rounded-3xl p-8 transition-all flex flex-col justify-between ${
            currentPlan === 'basic'
              ? 'bg-[#0E0E14] border-2 border-amber-500 shadow-xl shadow-amber-500/10'
              : 'bg-[#0E0E14] border border-white/[0.07] hover:border-white/20'
          }`}
        >
          {currentPlan === 'basic' && (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider shadow-lg">
              Current Active Plan
            </div>
          )}

          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                <Store className="w-4 h-4 text-amber-400" />
                <span>Standard Tier</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">Basic Restaurant</h3>
              <p className="text-xs text-gray-400 mt-1">
                Essential digital QR menu setup for cafes & small dining spots.
              </p>
            </div>

            {/* Pricing Durations Box */}
            <div className="grid grid-cols-2 rounded-2xl bg-[#08080A] border border-white/[0.08] divide-x divide-white/[0.08] overflow-hidden">
              <div className="p-4 flex flex-col justify-between space-y-3 text-center hover:bg-white/[0.02] transition-colors">
                <div>
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">6 MONTHS</span>
                  <p className="text-2xl font-black text-white mt-1">₹2,499</p>
                  <span className="text-[10px] text-gray-500">Valid for 6 Mo</span>
                </div>
                <button
                  type="button"
                  onClick={() => openDemoPayment('basic', 'Basic Restaurant (6 Months)', '6 Months', 2499)}
                  className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black font-extrabold text-[11px] transition-all border border-amber-500/30 flex items-center justify-center space-x-1"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Demo Pay ₹2,499</span>
                </button>
              </div>

              <div className="p-4 flex flex-col justify-between space-y-3 text-center bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                <div>
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">LIFETIME</span>
                  <p className="text-2xl font-black text-amber-400 mt-1">₹9,999</p>
                  <span className="text-[10px] text-amber-400/80">One-Time Pay</span>
                </div>
                <button
                  type="button"
                  onClick={() => openDemoPayment('basic', 'Basic Restaurant (Lifetime)', 'Lifetime Access', 9999)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] transition-all flex items-center justify-center space-x-1 shadow-md"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Demo Pay ₹9,999</span>
                </button>
              </div>
            </div>

            {/* Plan Features List */}
            <ul className="space-y-3 pt-4 border-t border-white/[0.08]">
              <li className="flex items-center space-x-3 text-xs text-gray-300">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>1 Digital Restaurant Menu</span>
              </li>
              <li className="flex items-center space-x-3 text-xs text-gray-300">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Unlimited Food Categories & Menu Items</span>
              </li>
              <li className="flex items-center space-x-3 text-xs text-gray-300">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>High-Resolution Master Table QR Code</span>
              </li>
              <li className="flex items-center space-x-3 text-xs text-gray-300">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Instant SOLD OUT & Availability Toggles</span>
              </li>
              <li className="flex items-center space-x-3 text-xs text-gray-300">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Fast Mobile Customer Menu View</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={() => handleSelectPlan('basic')}
              disabled={currentPlan === 'basic' || loadingPlan === 'basic'}
              className={`w-full py-3.5 rounded-full font-extrabold text-xs transition-all ${
                currentPlan === 'basic'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 cursor-default'
                  : 'bg-white text-black hover:bg-gray-200 shadow-md'
              }`}
            >
              {loadingPlan === 'basic'
                ? 'Updating Plan...'
                : currentPlan === 'basic'
                ? 'Active Basic Plan'
                : 'Select Basic Plan'}
            </button>
          </div>
        </div>

        {/* CARD 2: PREMIUM RESTAURANT */}
        <div
          className={`relative rounded-3xl p-8 transition-all flex flex-col justify-between gold-glow ${
            currentPlan === 'premium'
              ? 'bg-[#0E0E14] border-2 border-amber-500'
              : 'bg-[#0E0E14] border border-white/[0.07] hover:border-amber-500/50'
          }`}
        >
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center space-x-1">
            <Crown className="w-3.5 h-3.5 text-black fill-black" />
            <span>Recommended</span>
          </div>

          <div className="space-y-6 pt-2">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Full Pro Suite</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">Premium Restaurant</h3>
              <p className="text-xs text-gray-300 mt-1">
                Complete QR platform for busy restaurants & fine dining.
              </p>
            </div>

            {/* Pricing Durations Box */}
            <div className="grid grid-cols-2 rounded-2xl bg-[#08080A] border border-amber-500/30 divide-x divide-amber-500/30 overflow-hidden">
              <div className="p-4 flex flex-col justify-between space-y-3 text-center hover:bg-white/[0.02] transition-colors">
                <div>
                  <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest block">6 MONTHS</span>
                  <p className="text-2xl font-black text-white mt-1">₹5,999</p>
                  <span className="text-[10px] text-gray-400">Valid for 6 Mo</span>
                </div>
                <button
                  type="button"
                  onClick={() => openDemoPayment('premium', 'Premium Restaurant (6 Months)', '6 Months', 5999)}
                  className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black font-extrabold text-[11px] transition-all border border-amber-500/30 flex items-center justify-center space-x-1"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Demo Pay ₹5,999</span>
                </button>
              </div>

              <div className="p-4 flex flex-col justify-between space-y-3 text-center bg-amber-500/10 hover:bg-amber-500/20 transition-colors">
                <div>
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">LIFETIME</span>
                  <p className="text-2xl font-black text-amber-400 mt-1">₹24,999</p>
                  <span className="text-[10px] text-amber-400/90">One-Time Pay</span>
                </div>
                <button
                  type="button"
                  onClick={() => openDemoPayment('premium', 'Premium Restaurant (Lifetime)', 'Lifetime Access', 24999)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] transition-all flex items-center justify-center space-x-1 shadow-md"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Demo Pay ₹24,999</span>
                </button>
              </div>
            </div>

            {/* Plan Features List */}
            <ul className="space-y-3 pt-4 border-t border-amber-500/20">
              <li className="flex items-center space-x-3 text-xs text-gray-200">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Everything in Basic Plan</span>
              </li>
              <li className="flex items-center space-x-3 text-xs text-gray-200">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Table-Specific QR Codes (Table 1 to 25)</span>
              </li>
              <li className="flex items-center space-x-3 text-xs text-gray-200">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Real-Time Table Ordering & Kitchen Display</span>
              </li>
              <li className="flex items-center space-x-3 text-xs text-gray-200">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Call Waiter & Bill Request Alerts</span>
              </li>
              <li className="flex items-center space-x-3 text-xs text-gray-200">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Customer Feedback & Rating System</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={() => handleSelectPlan('premium')}
              disabled={currentPlan === 'premium' || loadingPlan === 'premium'}
              className={`w-full py-3.5 rounded-full font-extrabold text-xs transition-all ${
                currentPlan === 'premium'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                  : 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20'
              }`}
            >
              {loadingPlan === 'premium'
                ? 'Upgrading Plan...'
                : currentPlan === 'premium'
                ? 'Active Premium Plan'
                : 'Upgrade to Premium Plan'}
            </button>
          </div>
        </div>
      </div>

      {/* Demo Payment Modal */}
      <DemoPaymentModal
        isOpen={demoPaymentModal.isOpen}
        onClose={() => setDemoPaymentModal({ isOpen: false, planDetails: null })}
        planDetails={demoPaymentModal.planDetails}
        onSuccess={handleSelectPlan}
      />
    </div>
  );
}
