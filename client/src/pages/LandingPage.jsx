import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Zap,
  QrCode,
  Smartphone,
  CheckCircle,
  BarChart2,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Check,
  Send,
  MessageCircle,
} from 'lucide-react';

export default function LandingPage() {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    restaurantName: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', restaurantName: '', phone: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-20 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.15] text-white">
            India’s #1 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-white">
              QR Dining Solution
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Transform your restaurant with seamless digital menus, QR ordering, and smart customer engagement.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-black font-extrabold text-sm transition-all hover:bg-gray-200 shadow-xl"
            >
              <span>Get Started</span>
            </Link>

            <Link
              to="/menu/spice-garden"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-transparent border border-white/20 text-white font-bold text-sm transition-all hover:bg-white/10"
            >
              <span>Live Demo</span>
            </Link>
          </div>

          {/* Dual Phone Showcase Frame */}
          <div className="pt-10 max-w-3xl mx-auto">
            <div className="bg-[#0D0D0D] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-white/5 pointer-events-none" />
              
              <div className="flex items-center justify-center gap-4 sm:gap-8 py-4">
                {/* Phone 1: Customer Menu Preview */}
                <div className="w-40 sm:w-56 bg-[#121212] border-4 border-gray-800 rounded-[32px] p-3 shadow-2xl transform -rotate-3 transition-transform group-hover:rotate-0">
                  <div className="w-12 h-1 bg-gray-800 rounded-full mx-auto mb-2" />
                  <div className="bg-[#0A0F1D] rounded-2xl p-3 space-y-2 text-left">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                      <span className="text-[10px] font-black text-amber-400 uppercase">Spice Garden</span>
                      <span className="text-[8px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">VEG & NON-VEG</span>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <div className="bg-gray-800/60 p-2 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-bold text-white">Paneer Tikka</p>
                          <p className="text-[8px] text-amber-400 font-bold">₹320</p>
                        </div>
                        <div className="w-5 h-5 rounded-lg bg-amber-500 text-black text-[8px] font-black flex items-center justify-center">+</div>
                      </div>
                      <div className="bg-gray-800/60 p-2 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-bold text-white">Chicken Dum Biryani</p>
                          <p className="text-[8px] text-amber-400 font-bold">₹360</p>
                        </div>
                        <div className="w-5 h-5 rounded-lg bg-amber-500 text-black text-[8px] font-black flex items-center justify-center">+</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone 2: Order Tracker & Waiter Call */}
                <div className="w-40 sm:w-56 bg-[#121212] border-4 border-gray-800 rounded-[32px] p-3 shadow-2xl transform rotate-3 transition-transform group-hover:rotate-0">
                  <div className="w-12 h-1 bg-gray-800 rounded-full mx-auto mb-2" />
                  <div className="bg-[#0A0F1D] rounded-2xl p-3 space-y-2 text-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <p className="text-[10px] font-extrabold text-white">Order Sent to Kitchen!</p>
                    <span className="text-[8px] text-gray-400 block">Table #12 • Instant Notification</span>
                    <div className="py-1 px-2 rounded-lg bg-amber-500 text-black text-[9px] font-black">
                      Call Waiter Active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SUB-HERO BANNER */}
      <section className="py-16 bg-[#080808] border-y border-white/5 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            The future of dining is here.
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Elevate customer satisfaction, streamline operations, and boost sales with FlashMenu’s all-in-one digital menu platform built for modern restaurants.
          </p>
        </div>
      </section>

      {/* 3. WHAT WE OFFER */}
      <section id="offer" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">What We Offer</h2>
          <p className="text-xs sm:text-sm text-gray-400">Everything you need to run a modern, digital restaurant menu.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#0C0C0C] border border-white/10 p-8 rounded-3xl text-left space-y-4 hover:border-amber-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">QR-Based Menus</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Instantly generate QR codes for tables that lead to your interactive digital menu.
            </p>
          </div>

          <div className="bg-[#0C0C0C] border border-white/10 p-8 rounded-3xl text-left space-y-4 hover:border-amber-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Easy Ordering</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Customers can browse menu items, filter dietary options, and place orders directly.
            </p>
          </div>

          <div className="bg-[#0C0C0C] border border-white/10 p-8 rounded-3xl text-left space-y-4 hover:border-amber-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">WhatsApp Billing</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Send receipts & order updates directly to customer WhatsApp numbers effortlessly.
            </p>
          </div>

          <div className="bg-[#0C0C0C] border border-white/10 p-8 rounded-3xl text-left space-y-4 hover:border-amber-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Customer Insights</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Track menu views, top-selling dishes, and customer feedback in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* 4. MENUS THAT CUSTOMERS CAN'T RESIST */}
      <section className="py-20 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 text-left">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Menus that <br />
              customers <br />
              <span className="text-amber-400">can't resist.</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">Powerful Digital Solutions.</p>
          </div>

          {/* Circular Node Diagram Graphic */}
          <div className="relative flex items-center justify-center py-10">
            <div className="w-64 h-64 rounded-full border border-white/10 flex items-center justify-center relative">
              <div className="w-32 h-32 rounded-full bg-[#121212] border border-amber-500/40 flex items-center justify-center text-center p-3 shadow-xl">
                <span className="font-extrabold text-sm text-white">Flash<span className="text-amber-400">Menu</span></span>
              </div>

              {/* Node 1: Top */}
              <div className="absolute -top-4 bg-[#141414] border border-white/20 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-200">
                Instant Scans
              </div>
              {/* Node 2: Right */}
              <div className="absolute -right-6 bg-[#141414] border border-white/20 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-200">
                Easy Orders
              </div>
              {/* Node 3: Bottom */}
              <div className="absolute -bottom-4 bg-[#141414] border border-white/20 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-200">
                Fast Payments
              </div>
              {/* Node 4: Left */}
              <div className="absolute -left-6 bg-[#141414] border border-white/20 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-200">
                Real-Time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. A WIN-WIN FOR EVERYONE */}
      <section id="win-win" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">A win-win for everyone.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-5xl mx-auto">
          {/* Card: For Customers */}
          <div className="bg-[#0C0C0C] border border-white/10 p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold text-white">For Customers</h3>
            <ul className="space-y-4 text-xs sm:text-sm text-gray-300">
              <li className="flex items-center space-x-3">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Fast & easy menu browsing</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>No app download required</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Real-time item availability</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Instant waiter calls & bill requests</span>
              </li>
            </ul>
          </div>

          {/* Card: For Restaurant Owners */}
          <div className="bg-[#0C0C0C] border border-white/10 p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold text-white">For Restaurant Owners</h3>
            <ul className="space-y-4 text-xs sm:text-sm text-gray-300">
              <li className="flex items-center space-x-3">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Eliminate paper menu printing costs</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Instant price & item updates</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Collect valuable customer feedback</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Boost average order value by 25%</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-[#080808] border-y border-white/5 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">How It Works</h2>
            <p className="text-xs sm:text-sm text-gray-400">Four simple steps to transform your dining experience.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-white text-black font-black text-base flex items-center justify-center mx-auto shadow-lg">
                1
              </div>
              <h3 className="text-base font-bold text-white">Scan QR</h3>
              <p className="text-xs text-gray-400">Customer scans table QR code with camera.</p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-white text-black font-black text-base flex items-center justify-center mx-auto shadow-lg">
                2
              </div>
              <h3 className="text-base font-bold text-white">Browse Menu</h3>
              <p className="text-xs text-gray-400">Explore categories, photos, and prices.</p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-white text-black font-black text-base flex items-center justify-center mx-auto shadow-lg">
                3
              </div>
              <h3 className="text-base font-bold text-white">Order & Pay</h3>
              <p className="text-xs text-gray-400">Select dishes and complete order.</p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-white text-black font-black text-base flex items-center justify-center mx-auto shadow-lg">
                4
              </div>
              <h3 className="text-base font-bold text-white">Enjoy</h3>
              <p className="text-xs text-gray-400">Fresh food served right to table.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING SECTION */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Select Plan</h2>
          <p className="text-xs sm:text-sm text-gray-400">Transparent pricing for modern digital restaurant menus.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {/* BASIC PLAN */}
          <div className="bg-[#0C0C0C] border border-white/10 p-8 rounded-3xl space-y-6 flex flex-col justify-between hover:border-amber-500/50 transition-all">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Basic Restaurant</h3>
              <p className="text-xs text-gray-400">Essential digital QR menu setup for cafes & small dining spots.</p>
              
              <div className="grid grid-cols-2 rounded-2xl bg-[#050505] border border-white/10 divide-x divide-white/10 overflow-hidden">
                <div className="p-3 text-center space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 block">6 MONTHS</span>
                  <span className="text-xl font-black text-white block">₹2,499</span>
                </div>
                <div className="p-3 text-center space-y-1 bg-white/5">
                  <span className="text-[10px] font-bold text-amber-400 block">LIFETIME</span>
                  <span className="text-xl font-black text-amber-400 block">₹9,999</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-gray-300 pt-4 border-t border-white/10">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>1 Digital Restaurant Menu</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Unlimited Dishes & Categories</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Instant SOLD OUT Toggle</span>
                </li>
              </ul>
            </div>

            <Link
              to="/signup"
              className="w-full py-3.5 rounded-full bg-white text-black font-extrabold text-xs transition-all hover:bg-gray-200 text-center block"
            >
              Get Started with Basic
            </Link>
          </div>

          {/* PREMIUM PLAN */}
          <div className="bg-[#0C0C0C] border-2 border-amber-500 p-8 rounded-3xl space-y-6 flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider">
              RECOMMENDED
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Premium Restaurant</h3>
              <p className="text-xs text-gray-400">Complete QR platform for busy restaurants & fine dining.</p>
              
              <div className="grid grid-cols-2 rounded-2xl bg-[#050505] border border-amber-500/30 divide-x divide-amber-500/30 overflow-hidden">
                <div className="p-3 text-center space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 block">6 MONTHS</span>
                  <span className="text-xl font-black text-white block">₹5,999</span>
                </div>
                <div className="p-3 text-center space-y-1 bg-amber-500/10">
                  <span className="text-[10px] font-bold text-amber-400 block">LIFETIME</span>
                  <span className="text-xl font-black text-amber-400 block">₹24,999</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-gray-300 pt-4 border-t border-white/10">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Everything in Basic Plan</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Table-Specific QR Codes (Table 1-25)</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Call Waiter & Bill Request Alerts</span>
                </li>
              </ul>
            </div>

            <Link
              to="/signup"
              className="w-full py-3.5 rounded-full bg-amber-500 text-black font-extrabold text-xs transition-all hover:bg-amber-400 text-center block shadow-lg"
            >
              Get Premium Plan
            </Link>
          </div>
        </div>
      </section>

      {/* 8. UPGRADE CTA BANNER */}
      <section className="py-24 bg-[#080808] border-y border-white/5 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Upgrade Your Restaurant Experience Today
          </h2>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-black font-extrabold text-sm transition-all hover:bg-gray-200 shadow-xl"
          >
            Get Started With FlashMenu
          </Link>
        </div>
      </section>

      {/* 9. LET'S TALK / CONTACT FORM */}
      <section id="contact" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* Left Column: Let's Talk */}
          <div className="space-y-6 text-left">
            <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
              Let's talk.
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-md">
              Have questions about setting up FlashMenu for your restaurant? Get in touch with our team.
            </p>

            <div>
              <a
                href="https://wa.me/919876543210?text=Hi%20FlashMenu%20Team,%20I%20want%20to%20know%20more%20about%20setting%20up%20QR%20menus!"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-[#0C0C0C] border border-white/10 p-8 rounded-3xl space-y-4 text-left">
            {contactSubmitted ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Message Sent!</h3>
                <p className="text-xs text-gray-400">Our team will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10 text-white text-xs focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Spice Garden"
                    value={contactForm.restaurantName}
                    onChange={(e) => setContactForm({ ...contactForm, restaurantName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10 text-white text-xs focus:outline-none focus:border-white/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10 text-white text-xs focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="owner@restaurant.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10 text-white text-xs focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about your restaurant..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10 text-white text-xs focus:outline-none focus:border-white/30 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-white text-black font-extrabold text-xs transition-all hover:bg-gray-200 shadow-md"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
