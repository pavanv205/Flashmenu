import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  ArrowRight,
  Store,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Star,
  Layers,
  Crown,
  CreditCard,
  Eye,
  EyeOff,
} from 'lucide-react';
import DemoPaymentModal from '../components/DemoPaymentModal';
import { useAuth } from '../context/AuthContext';
import FlashLogoBadge from '../components/FlashLogoBadge';

export default function SignupPage() {
  const [step, setStep] = useState(1); // 1 = Registration Form, 2 = Select Subscription Plan
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    restaurantName: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    cuisineType: 'Multi-Cuisine',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [demoPaymentModal, setDemoPaymentModal] = useState({ isOpen: false, planDetails: null });

  const { register } = useAuth();
  const navigate = useNavigate();

  const openDemoPayment = (planKey, planName, cycleName, price) => {
    setSelectedPlan(planKey);
    setDemoPaymentModal({
      isOpen: true,
      planDetails: {
        planKey,
        title: planName,
        planName,
        duration: cycleName,
        cycleName,
        amount: price,
        price,
      },
    });
  };

  const handleOpenDemoPayment = (planKey, planName, cycleName, price) => {
    openDemoPayment(planKey, planName, cycleName, price);
  };

  const handleDemoPaymentSuccess = (planKey) => {
    handleFinishOnboarding(planKey);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitAccount = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      // Move to Step 2: Select Subscription Plan
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create restaurant account. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishOnboarding = (planKey) => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#08080A] flex items-center justify-center p-4 py-12 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* STEP 1: RESTAURANT ACCOUNT CREATION FORM */}
      {step === 1 && (
        <div className="w-full max-w-xl bg-dark-card border border-dark-border rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center space-x-3">
              <FlashLogoBadge size="lg" />
              <span className="font-extrabold text-2xl text-white">
                Flash<span className="gold-gradient-text">Menu</span>
              </span>
            </Link>
            <h2 className="text-2xl font-bold text-white pt-2">Create Your Restaurant Menu</h2>
            <p className="text-xs text-gray-400">Setup your digital menu in under 2 minutes</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmitAccount} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Restaurant Name *
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="restaurantName"
                    required
                    placeholder="e.g. Royal Feast"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Owner Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Vikram Singh"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="owner@restaurant.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g. Mumbai"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="e.g. Bandra West"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-white transition-colors"
                    title={showPassword ? 'Hide password' : 'View password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-white transition-colors"
                    title={showConfirmPassword ? 'Hide password' : 'View password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center space-x-2 mt-4"
            >
              <span>{loading ? 'Creating Restaurant...' : 'Create My Restaurant Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      )}

      {/* STEP 2: SELECT SUBSCRIPTION PLAN (BASIC VS PREMIUM) */}
      {step === 2 && (
        <div className="w-full max-w-4xl bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10 space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Account Created Successfully!</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Choose Your Subscription Plan</h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto">
              Select the plan that best fits <span className="text-amber-400 font-bold">{formData.restaurantName || 'your restaurant'}</span>. You can upgrade or change plans at any time.
            </p>
          </div>

          {/* 2 Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PLAN 1: BASIC RESTAURANT */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border transition-all flex flex-col justify-between space-y-6 relative ${
                selectedPlan === 'basic'
                  ? 'bg-dark-base border-amber-500 shadow-xl shadow-amber-500/10'
                  : 'bg-dark-base/60 border-dark-border hover:border-gray-700'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <Store className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold border border-amber-500/30">
                    Standard Tier
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">Basic Restaurant</h3>
                  <p className="text-xs text-gray-400 mt-1">Essential digital QR menu setup for cafes & small dining spots.</p>
                </div>

                {/* Price Durations Display */}
                <div className="grid grid-cols-2 rounded-2xl bg-dark-card border border-dark-border divide-x divide-dark-border overflow-hidden">
                  <div className="p-3 text-center space-y-1">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">5 MINUTES</span>
                    <span className="text-xl font-black text-white block">₹1</span>
                    <span className="text-[10px] text-gray-500 font-semibold block">Valid for 5 Mins</span>
                  </div>
                  <div className="p-3 text-center space-y-1 bg-amber-500/5">
                    <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">LIFETIME</span>
                    <span className="text-xl font-black text-amber-400 block">₹1</span>
                    <span className="text-[10px] text-amber-400/80 font-bold block">One-Time Pay</span>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-gray-300 pt-4 border-t border-dark-border">
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>1 Digital Restaurant Menu</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Unlimited Food Categories & Menu Items</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>1 Master QR Code</strong> (Entire Restaurant)</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Instant SOLD OUT & Availability Toggle</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Fast Mobile Customer View</span>
                  </li>
                </ul>
              </div>

              {/* Two Payment Option Buttons at Bottom of Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleOpenDemoPayment('basic', 'Basic Restaurant (5 Mins)', '5 Minutes Test', 1)
                  }
                  className="py-3.5 px-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black font-extrabold text-xs transition-all border border-amber-500/30 flex items-center justify-center space-x-1.5 shadow-md"
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>Pay 5 Mins (₹1)</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleOpenDemoPayment('basic', 'Basic Restaurant (Lifetime)', 'Lifetime One-Time', 1)
                  }
                  className="py-3.5 px-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-1.5"
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>Pay Lifetime (₹1)</span>
                </button>
              </div>
            </div>

            {/* PLAN 2: PREMIUM RESTAURANT */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-6 relative ${
                selectedPlan === 'premium'
                  ? 'bg-gradient-to-b from-dark-base to-[#182338] border-amber-500 gold-glow'
                  : 'bg-dark-base/60 border-amber-500/50'
              }`}
            >
              {/* Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-black text-[11px] font-black uppercase tracking-wider flex items-center space-x-1 shadow-lg">
                <Crown className="w-3.5 h-3.5 text-black fill-black" />
                <span>Recommended</span>
              </div>

              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold border border-amber-500/30">
                    Full Pro Suite
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <span>Premium Restaurant</span>
                  </h3>
                  <p className="text-xs text-gray-300 mt-1">Complete QR platform for busy restaurants & fine dining.</p>
                </div>

                {/* Price Durations Display */}
                <div className="grid grid-cols-2 rounded-2xl bg-dark-card border border-amber-500/30 divide-x divide-amber-500/30 overflow-hidden">
                  <div className="p-3 text-center space-y-1">
                    <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest block">5 MINUTES</span>
                    <span className="text-xl font-black text-white block">₹1</span>
                    <span className="text-[10px] text-gray-400 font-semibold block">Valid for 5 Mins</span>
                  </div>
                  <div className="p-3 text-center space-y-1 bg-amber-500/10">
                    <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">LIFETIME</span>
                    <span className="text-xl font-black text-amber-400 block">₹1</span>
                    <span className="text-[10px] text-amber-400/90 font-bold block">One-Time Pay</span>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-gray-200 pt-4 border-t border-amber-500/20">
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Everything in Basic Plan</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Table-Specific QR Codes (Table 1 to 25)</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Real-Time Table Ordering & Kitchen Display</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Instant Call Waiter & Bill Request Alerts</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Customer Feedback & Rating System</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Priority VIP 24/7 Support & Analytics</span>
                  </li>
                </ul>
              </div>

              {/* Two Payment Option Buttons at Bottom of Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleOpenDemoPayment('premium', 'Premium Restaurant (5 Mins)', '5 Minutes Test', 1)
                  }
                  className="py-3.5 px-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black font-extrabold text-xs transition-all border border-amber-500/30 flex items-center justify-center space-x-1.5 shadow-md"
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>Pay 5 Mins (₹1)</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleOpenDemoPayment('premium', 'Premium Restaurant (Lifetime)', 'Lifetime One-Time', 1)
                  }
                  className="py-3.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-1.5"
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>Pay Lifetime (₹1)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Payment Modal */}
      <DemoPaymentModal
        isOpen={demoPaymentModal.isOpen}
        onClose={() => setDemoPaymentModal({ isOpen: false, planDetails: null })}
        planDetails={demoPaymentModal.planDetails}
        onSuccess={handleDemoPaymentSuccess}
      />
    </div>
  );
}
