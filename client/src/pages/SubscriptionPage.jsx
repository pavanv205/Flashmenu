import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { restaurantAPI } from '../services/api';
import { Check, Sparkles, Zap, Crown, Store, CreditCard, Clock, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';
import DemoPaymentModal from '../components/DemoPaymentModal';

export default function SubscriptionPage() {
  const { user, restaurant, updateRestaurantState } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState('');
  const [demoPaymentModal, setDemoPaymentModal] = useState({ isOpen: false, planDetails: null });

  const isAdminUser =
    user?.role === 'admin' ||
    String(user?.email || '').toLowerCase().trim() === 'pavanvadapalli205@gmail.com';

  const hasEverPaid = Boolean(restaurant && restaurant.subscriptionStartDate);
  const isLifetime = isAdminUser || restaurant?.subscriptionCycle === 'lifetime';
  const expiresAtDate = restaurant?.subscriptionExpiresAt ? new Date(restaurant.subscriptionExpiresAt) : null;
  const startDateDate = restaurant?.subscriptionStartDate ? new Date(restaurant.subscriptionStartDate) : null;
  
  const [timeLeftSec, setTimeLeftSec] = useState(0);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [hasDismissedModal, setHasDismissedModal] = useState(false);

  const isExpired = !isAdminUser && (
    (!isLifetime && expiresAtDate && expiresAtDate.getTime() <= Date.now()) ||
    (hasEverPaid && restaurant?.isActive === false)
  );

  const isPaidAccount = isAdminUser || (hasEverPaid && !isExpired && restaurant?.isActive !== false);
  const currentPlan = isAdminUser ? 'premium' : isPaidAccount ? (restaurant?.subscriptionPlan || 'basic') : 'UNPAID';

  useEffect(() => {
    if (isExpired && !isAdminUser && !hasDismissedModal) {
      setShowExpiredModal(true);
    }
  }, [isExpired, isAdminUser, hasDismissedModal]);

  useEffect(() => {
    if (isLifetime || !expiresAtDate || !hasEverPaid) return;
    const updateTimer = () => {
      const diffMs = new Date(restaurant.subscriptionExpiresAt).getTime() - Date.now();
      const secs = Math.max(0, Math.floor(diffMs / 1000));
      setTimeLeftSec(secs);
      if (secs <= 0 && !isAdminUser && !hasDismissedModal) {
        setShowExpiredModal(true);
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [restaurant, isLifetime, expiresAtDate, hasEverPaid, isAdminUser, hasDismissedModal]);

  const formatTimer = (totalSec) => {
    if (totalSec > 3600) {
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSelectPlan = async (updatedRestPayload) => {
    try {
      setShowExpiredModal(false);
      if (updatedRestPayload && typeof updatedRestPayload === 'object' && updatedRestPayload._id) {
        updateRestaurantState(updatedRestPayload);
      } else {
        const res = await restaurantAPI.getMyRestaurant();
        if (res.data) {
          updateRestaurantState(res.data);
        }
      }
    } catch (error) {
      console.error('Failed to sync restaurant state after payment:', error);
    }
  };

  const getPlanRank = (planKey, isLife) => {
    const isPrem = String(planKey || '').toLowerCase().includes('premium');
    if (isPrem && isLife) return 40;
    if (isPrem && !isLife) return 30;
    if (!isPrem && isLife) return 20;
    return 10;
  };

  const currentRank = (!isPaidAccount || isExpired) ? 0 : getPlanRank(currentPlan, isLifetime);

  const openDemoPayment = (planKey, title, duration, amount) => {
    const isSelectingLifetime = String(duration || '').toLowerCase().includes('lifetime');
    const targetRank = getPlanRank(planKey, isSelectingLifetime);

    if (isPaidAccount && !isExpired && targetRank < currentRank) {
      alert('Downgrading subscription is not allowed. You can only upgrade your subscription plan.');
      return;
    }

    setDemoPaymentModal({
      isOpen: true,
      planDetails: { planKey, title, duration, amount },
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans relative">
      {/* EXPIRED PLAN POPUP MODAL */}
      {showExpiredModal && (
        <div
          onClick={() => {
            setShowExpiredModal(false);
            setHasDismissedModal(true);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0E0E14] border-2 border-red-500/60 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl shadow-red-500/20 space-y-5 cursor-default"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center mx-auto text-red-500">
              <AlertTriangle className="w-8 h-8 text-red-500 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                Subscription Expired!
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Your subscription plan for <strong className="text-white">{restaurant?.name || 'your restaurant'}</strong> has ended.
              </p>
              <p className="text-[11px] text-amber-400/90 font-semibold bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
                ⚡ Select a plan below to instantly reactivate your restaurant dashboard & QR menu.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowExpiredModal(false);
                setHasDismissedModal(true);
              }}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-black text-xs transition-all shadow-lg shadow-red-500/30 uppercase tracking-wider cursor-pointer active:scale-95"
            >
              Select Plan & Renew Now →
            </button>
          </div>
        </div>
      )}

      {isExpired ? (
        /* EXPIRED PAYWALL HERO DISPLAY */
        <div className="text-center py-6 animate-fade-in space-y-4">
          <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mx-auto relative shadow-2xl shadow-red-500/10">
            <div className="w-12 h-14 bg-white/10 rounded-xl border border-white/20 flex flex-col justify-around p-2 space-y-1">
              <div className="w-full h-1 bg-red-400/80 rounded"></div>
              <div className="w-3/4 h-1 bg-red-400/60 rounded"></div>
              <div className="w-full h-1 bg-red-400/80 rounded"></div>
              <div className="w-1/2 h-1 bg-red-400/40 rounded"></div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center font-black text-base border-2 border-[#08080A] shadow-lg">
              ✕
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              Your subscription plan has
              <span className="block text-4xl sm:text-6xl font-black text-red-500 tracking-tight mt-1 mb-2 uppercase animate-pulse">
                EXPIRED!
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
              Select a plan below to renew and continue enjoying our services.
            </p>
          </div>

          <div className="flex items-center justify-center space-x-4 pt-6 max-w-2xl mx-auto">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest px-3">Choose Your Plan</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>
        </div>
      ) : !hasEverPaid ? (
        /* UNPAID / PENDING PAYMENT HERO DISPLAY */
        <div className="text-center py-6 animate-fade-in space-y-4">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto relative shadow-2xl shadow-amber-500/10">
            <CreditCard className="w-9 h-9 text-amber-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              Activation Required:
              <span className="block text-3xl sm:text-5xl font-black text-amber-400 tracking-tight mt-1 mb-2 uppercase animate-pulse">
                Select A Subscription Plan
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
              Complete a plan payment below to activate <span className="text-white font-bold">{restaurant?.name || 'your restaurant'}</span> and unlock full dashboard access.
            </p>
          </div>

          <div className="flex items-center justify-center space-x-4 pt-4 max-w-2xl mx-auto">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest px-3">Available Restaurant Tiers</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>
        </div>
      ) : (
        /* NORMAL ACTIVE PLAN BANNER */
        <>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Subscription & Plan Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Select or upgrade your FlashMenu tier for your restaurant (<span className="text-amber-400 font-bold">{restaurant?.name || 'My Restaurant'}</span>)
            </p>
          </div>

          {/* Active Subscription Status Banner Card */}
          <div className={`p-6 rounded-3xl border transition-all ${
            isLifetime
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
              : 'bg-[#0E0E14] border-white/[0.08] text-white'
          }`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    isLifetime ? 'bg-amber-400' : 'bg-emerald-500'
                  }`} />
                  <h2 className="text-base font-extrabold text-white flex items-center space-x-2">
                    <span>Current Plan:</span>
                    <span className="text-amber-400 uppercase font-black">{currentPlan} RESTAURANT</span>
                    <span className="text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40">
                      {isAdminUser ? '👑 Master Admin Lifetime VIP' : isLifetime ? 'Lifetime Access' : '4 Minutes Test Plan'}
                    </span>
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-1">
                  {startDateDate && (
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Started: <strong>{startDateDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</strong></span>
                    </div>
                  )}

                  {!isLifetime && expiresAtDate && (
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>Expires: <strong>{expiresAtDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                {isLifetime ? (
                  <div className="flex items-center space-x-2 bg-amber-500/20 border border-amber-500/50 px-4 py-2 rounded-2xl text-xs font-black text-amber-400">
                    <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Lifetime Unlimited Access</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 bg-emerald-500/15 border border-emerald-500/30 px-4 py-2 rounded-2xl text-xs font-black text-emerald-400">
                    <Clock className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Live Countdown: {formatTimer(timeLeftSec)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Restaurant Plans Cards (Hidden for Master Admin) */}
      {!isAdminUser && (
        <div className={currentPlan === 'premium' ? 'max-w-2xl mx-auto pt-4 w-full' : 'grid grid-cols-1 md:grid-cols-2 gap-8 pt-4'}>
        {/* CARD 1: BASIC RESTAURANT (Only shown if restaurant is NOT on Premium plan) */}
        {currentPlan !== 'premium' && (
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
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">4 MINUTES</span>
                    <p className="text-2xl font-black text-white mt-1">₹1</p>
                    <span className="text-[10px] text-gray-500">Valid for 4 Mins</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openDemoPayment('basic', 'Basic Restaurant (4 Mins)', '4 Minutes Test', 1)}
                    className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black font-extrabold text-[11px] transition-all border border-amber-500/30 flex items-center justify-center space-x-1"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{isExpired && currentPlan === 'basic' ? 'Renew 4 Mins (₹1)' : currentPlan === 'basic' ? 'Extend 4 Mins (₹1)' : 'Pay 4 Mins (₹1)'}</span>
                  </button>
                </div>

                <div className="p-4 flex flex-col justify-between space-y-3 text-center bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                  <div>
                    <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">LIFETIME</span>
                    <p className="text-2xl font-black text-amber-400 mt-1">₹1</p>
                    <span className="text-[10px] text-amber-400/80">One-Time Pay</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openDemoPayment('basic', 'Basic Restaurant (Lifetime)', 'Lifetime Access', 1)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] transition-all flex items-center justify-center space-x-1 shadow-md"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{isLifetime && currentPlan === 'basic' ? 'Lifetime Active (Re-Sync)' : 'Pay Lifetime (₹1)'}</span>
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
          </div>
        )}

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
                  <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest block">4 MINUTES</span>
                  <p className="text-2xl font-black text-white mt-1">₹1</p>
                  <span className="text-[10px] text-gray-400 font-semibold block">Valid for 4 Mins</span>
                </div>
                <button
                  type="button"
                  disabled={currentRank >= 40}
                  onClick={() => openDemoPayment('premium', 'Premium Restaurant (4 Mins)', '4 Minutes Test', 1)}
                  className={`w-full py-2.5 rounded-xl font-extrabold text-[11px] transition-all flex items-center justify-center space-x-1 ${
                    currentRank >= 40
                      ? 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed opacity-60'
                      : 'bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/30'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>
                    {currentRank >= 40
                      ? '👑 Lifetime VIP Active'
                      : isExpired && currentPlan === 'premium'
                      ? 'Renew 4 Mins (₹1)'
                      : currentPlan === 'basic'
                      ? 'Upgrade to Premium 4 Mins (₹1)'
                      : 'Extend 4 Mins (₹1)'}
                  </span>
                </button>
              </div>

              <div className="p-4 flex flex-col justify-between space-y-3 text-center bg-amber-500/10 hover:bg-amber-500/20 transition-colors">
                <div>
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">LIFETIME</span>
                  <p className="text-2xl font-black text-amber-400 mt-1">₹1</p>
                  <span className="text-[10px] text-amber-400/90">One-Time Pay</span>
                </div>
                <button
                  type="button"
                  disabled={currentRank >= 40}
                  onClick={() => openDemoPayment('premium', 'Premium Restaurant (Lifetime)', 'Lifetime Access', 1)}
                  className={`w-full py-2.5 rounded-xl font-black text-[11px] transition-all flex items-center justify-center space-x-1 shadow-md ${
                    currentRank >= 40
                      ? 'bg-amber-500/20 text-amber-400/70 border border-amber-500/30 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-400 text-black'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{currentRank >= 40 ? '👑 Premium Lifetime Active' : 'Upgrade to Premium Lifetime (₹1)'}</span>
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
        </div>
      </div>
      )}

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
