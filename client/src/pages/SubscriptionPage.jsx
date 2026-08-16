import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { restaurantAPI } from '../services/api';
import { Check, Sparkles, Zap, ShieldCheck, Crown } from 'lucide-react';

export default function SubscriptionPage() {
  const { restaurant, updateRestaurantState } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState('');

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

      {/* 2 Subscription Plans Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* BASIC RESTAURANT PLAN */}
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
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Free Forever</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">Basic Restaurant</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Essential digital QR menu for smart dining tables.
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-white">₹0</span>
                <span className="block text-[10px] text-gray-400 uppercase font-semibold">/ month</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-dark-border">
              <div className="flex items-center space-x-3 text-xs text-gray-300">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Unlimited Food Categories & Menu Items</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-300">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>High-Resolution Table QR Code Generator</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-300">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Instant SOLD OUT & Availability Toggles</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-300">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Fast Mobile Customer Menu View</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-500 line-through">
                <span className="w-4 h-4 shrink-0 text-center font-bold">✕</span>
                <span>Live Table Ordering & Kitchen Workflow</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-500 line-through">
                <span className="w-4 h-4 shrink-0 text-center font-bold">✕</span>
                <span>Real-Time Waiter Assistance Alerts</span>
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
                ? 'Selected Plan'
                : 'Downgrade to Basic'}
            </button>
          </div>
        </div>

        {/* PREMIUM RESTAURANT PLAN */}
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
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Pro Experience</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">Premium Restaurant</h3>
                <p className="text-xs text-gray-300 mt-1">
                  Complete table ordering, waiter call alerts & full analytics.
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-amber-400">₹999</span>
                <span className="block text-[10px] text-gray-400 uppercase font-semibold">/ month</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-dark-border">
              <div className="flex items-center space-x-3 text-xs text-white font-medium">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Everything in Basic Plan</span>
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
                <span>Daily Scan Volume & Peak Hour Analytics Graphs</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-amber-300 font-semibold">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Table 1 to 50 Customized QR Code Packs</span>
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
    </div>
  );
}
