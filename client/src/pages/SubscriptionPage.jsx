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
    if (planKey === currentPlan) return;
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
    <div className="space-y-8 max-w-6xl mx-auto">
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
              ? 'bg-dark-card border-2 border-amber-500 shadow-xl shadow-amber-500/10'
              : 'bg-dark-card/60 border border-dark-border hover:border-gray-700'
          }`}
        >
          {currentPlan === 'basic' && (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider shadow-lg">
              Current Active Plan
            </div>
          )}

          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <Store className="w-4 h-4 text-amber-400" />
                <span>Standard Tier</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">Basic Restaurant</h3>
              <p className="text-xs text-gray-400 mt-1">
                Essential digital QR menu setup for cafes & small dining spots.
              </p>
            </div>

            {/* Pricing Durations Box (Divided in Middle with Vertical Line & Demo Pay Buttons) */}
            <div className="grid grid-cols-2 rounded-2xl bg-dark-base border border-dark-border divide-x divide-dark-border overflow-hidden">
              {/* Left Half: 6 Months */}
              <div className="p-4 flex flex-col justify-between space-y-3 text-center hover:bg-dark-hover/30 transition-colors">
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

              {/* Right Half: Lifetime */}
              <div className="p-4 flex flex-col justify-between space-y-3 text-center bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                <div>
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">LIFETIME</span>
                  <p className="text-2xl font-black text-amber-400 mt-1">₹9,999</p>
                  <span className="text-[10px] text-amber-400/80">One-Time Pay</span>
                </div>
                <button
                  type="button"
                  onClick={() => openDemoPayment('basic', 'Basic Restaurant (Lifetime)', 'Lifetime One-Time', 9999)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] transition-all shadow-md shadow-amber-500/20 flex items-center justify-center space-x-1"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Demo Pay ₹9,999</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-xs text-gray-300">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>1 Digital Restaurant Menu</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-300">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Unlimited Food Categories & Menu Items</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-300">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>High-Resolution Master Table QR Code</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-300">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Instant SOLD OUT & Availability Toggles</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-300">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Fast Mobile Customer Menu View</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              onClick={() => handleSelectPlan('basic')}
              disabled={currentPlan === 'basic' || loadingPlan === 'basic'}
              className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all ${
                currentPlan === 'basic'
                  ? 'bg-dark-base text-gray-400 border border-dark-border cursor-default'
                  : 'bg-dark-hover text-white hover:bg-gray-800 border border-gray-700'
              }`}
            >
              {loadingPlan === 'basic'
                ? 'Updating...'
                : currentPlan === 'basic'
                ? 'Active Basic Plan'
                : 'Select Basic Plan'}
            </button>
          </div>
        </div>

        {/* CARD 2: PREMIUM RESTAURANT */}
        <div
          className={`relative rounded-3xl p-8 transition-all flex flex-col justify-between ${
            currentPlan === 'premium'
              ? 'bg-gradient-to-b from-dark-card via-[#141E33] to-dark-card border-2 border-amber-500 shadow-2xl gold-glow'
              : 'bg-gradient-to-b from-dark-card via-[#101726] to-dark-card border border-amber-500/50 hover:border-amber-500'
          }`}
        >
          {currentPlan === 'premium' ? (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider shadow-lg">
              Active Premium Plan
            </div>
          ) : (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-black text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center space-x-1">
              <Sparkles className="w-3 h-3 fill-black" />
              <span>Recommended</span>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Full Pro Suite</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">Premium Restaurant</h3>
              <p className="text-xs text-gray-300 mt-1">
                Complete QR platform for busy restaurants, ordering & fine dining.
              </p>
            </div>

            {/* Pricing Durations Box (Divided in Middle with Vertical Line & Demo Pay Buttons) */}
            <div className="grid grid-cols-2 rounded-2xl bg-dark-base border border-amber-500/40 divide-x divide-amber-500/30 overflow-hidden">
              {/* Left Half: 6 Months */}
              <div className="p-4 flex flex-col justify-between space-y-3 text-center hover:bg-dark-hover/30 transition-colors">
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

              {/* Right Half: Lifetime */}
              <div className="p-4 flex flex-col justify-between space-y-3 text-center bg-amber-500/10 hover:bg-amber-500/20 transition-colors">
                <div>
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">LIFETIME</span>
                  <p className="text-2xl font-black text-amber-400 mt-1">₹24,999</p>
                  <span className="text-[10px] text-amber-400/80">One-Time Pay</span>
                </div>
                <button
                  type="button"
                  onClick={() => openDemoPayment('premium', 'Premium Restaurant (Lifetime)', 'Lifetime One-Time', 24999)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] transition-all shadow-md shadow-amber-500/20 flex items-center justify-center space-x-1"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Demo Pay ₹24,999</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-xs text-white font-medium">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Everything in Basic Plan</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-amber-300 font-semibold">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Table-Specific QR Codes (Table 1 to 25)</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-amber-300 font-semibold">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Real-Time Table Ordering & Kitchen Display</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-amber-300 font-semibold">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Instant Call Waiter & Bill Request Alerts</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-amber-300 font-semibold">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Private Customer Reviews & Ratings Feed</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-amber-300 font-semibold">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Daily Scan Volume Analytics Graphs</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              onClick={() => handleSelectPlan('premium')}
              disabled={currentPlan === 'premium' || loadingPlan === 'premium'}
              className={`w-full py-3.5 rounded-xl font-extrabold text-xs transition-all ${
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
