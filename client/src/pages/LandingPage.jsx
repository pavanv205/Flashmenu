import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  MousePointer,
  Layers,
  Layout,
  Grid,
  Zap,
  CheckCircle,
  BarChart2,
  ArrowRight,
  Check,
  MessageCircle,
  Share2,
  ZoomIn,
  Eye,
  Sliders,
  Sparkles,
  QrCode,
} from 'lucide-react';

export default function LandingPage() {
  const [activeCanvasTab, setActiveCanvasTab] = useState('menu');
  const [selectedFrame, setSelectedFrame] = useState('table-qr');

  return (
    <div className="min-h-screen bg-[#08080A] text-white flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      <Navbar />

      {/* 1. FIGMA CANVAS HERO SECTION */}
      <section className="relative pt-20 pb-24 overflow-hidden text-center border-b border-purple-500/20 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px]">
        {/* Glow Spheres */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          {/* Floating Figma Tool Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#12121A] border border-purple-500/40 shadow-xl">
            <MousePointer className="w-4 h-4 text-purple-400 fill-purple-400" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-amber-300">
              FIGMA CANVAS DESIGN SYSTEM FOR RESTAURANTS
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
            Design & Launch Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-amber-400">
              QR Menu Like Figma.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Pixel-perfect digital menus, live multiplayer order syncing, and instant table QR generation — built on a clean Figma canvas workflow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-amber-500 text-white font-extrabold text-sm transition-all hover:scale-105 shadow-xl shadow-purple-500/25"
            >
              <span>Start Free Studio Trial</span>
            </Link>

            <Link
              to="/menu/spice-garden"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#12121A] border border-white/20 text-white font-bold text-sm transition-all hover:bg-white/10"
            >
              <span>Inspect Live Canvas</span>
            </Link>
          </div>

          {/* 2. FIGMA CANVAS SHOWCASE FRAME WITH MULTIPLAYER CURSORS */}
          <div className="pt-10 max-w-5xl mx-auto text-left">
            <div className="bg-[#121218] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl relative">
              {/* Figma Canvas Header Bar */}
              <div className="bg-[#1A1A24] border-b border-purple-500/20 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  </div>
                  <span className="text-xs font-bold text-gray-300 font-mono pl-2">FlashMenu_Canvas.fig</span>
                </div>

                {/* Canvas Toolbar Tools */}
                <div className="hidden sm:flex items-center space-x-2 bg-[#121218] px-3 py-1 rounded-xl border border-white/10 text-gray-400 text-xs">
                  <span className="text-white font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Frame</span>
                  <span className="px-2 hover:text-white cursor-pointer">Text</span>
                  <span className="px-2 hover:text-white cursor-pointer">Components</span>
                  <span className="px-2 hover:text-white cursor-pointer">Assets</span>
                </div>

                <div className="flex items-center space-x-3 text-xs text-gray-400 font-mono">
                  <span className="hidden sm:inline-block">100% Zoom</span>
                  <button className="px-3 py-1 rounded-lg bg-purple-600 text-white font-extrabold text-[11px] flex items-center space-x-1">
                    <Share2 className="w-3 h-3" />
                    <span>Share Studio</span>
                  </button>
                </div>
              </div>

              {/* Canvas Workspace Artboard */}
              <div className="p-6 sm:p-10 bg-[#0A0A10] bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px] relative">
                
                {/* Floating Multiplayer Cursor 1: Admin */}
                <div className="absolute top-12 left-12 z-20 animate-pulse hidden sm:flex items-center space-x-1">
                  <MousePointer className="w-5 h-5 text-purple-400 fill-purple-400 transform -rotate-45" />
                  <span className="bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg">
                    Pavan (Owner)
                  </span>
                </div>

                {/* Floating Multiplayer Cursor 2: Kitchen Chef */}
                <div className="absolute bottom-16 right-16 z-20 hidden sm:flex items-center space-x-1">
                  <MousePointer className="w-5 h-5 text-emerald-400 fill-emerald-400 transform -rotate-45" />
                  <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg">
                    Chef (Kitchen)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Artboard Frame 1: Mobile Customer View */}
                  <div className="bg-[#12121C] border border-purple-500/40 rounded-3xl p-5 shadow-2xl relative">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center space-x-2">
                        <Layout className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold text-white">Frame / iPhone 15 Pro</span>
                      </div>
                      <span className="text-[9px] bg-purple-500/20 text-purple-300 font-extrabold px-2 py-0.5 rounded-full">
                        LIVE SYNC
                      </span>
                    </div>

                    <div className="space-y-3 pt-3">
                      <div className="p-3 rounded-2xl bg-[#08080E] border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">Butter Chicken Special</p>
                          <p className="text-[10px] text-amber-400 font-bold">₹380</p>
                        </div>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-extrabold px-2 py-1 rounded-lg">
                          IN STOCK
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#08080E] border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">Paneer Tikka Masala</p>
                          <p className="text-[10px] text-amber-400 font-bold">₹340</p>
                        </div>
                        <span className="text-[9px] bg-red-500/20 text-red-400 font-extrabold px-2 py-1 rounded-lg">
                          SOLD OUT
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Artboard Frame 2: Table QR Component */}
                  <div className="bg-[#12121C] border border-amber-500/40 rounded-3xl p-5 shadow-2xl relative">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center space-x-2">
                        <QrCode className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white">Component / Table QR Card</span>
                      </div>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-full">
                        TABLE #12
                      </span>
                    </div>

                    <div className="p-6 text-center space-y-3 pt-4">
                      <div className="w-24 h-24 bg-white p-2 rounded-2xl mx-auto shadow-inner flex items-center justify-center">
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://flashmenu-five.vercel.app/menu/spice-garden"
                          alt="Table QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-xs font-extrabold text-white">Scan to Order at Table #12</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. FIGMA CANVAS FEATURES GRID */}
      <section id="canvas-features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Grid className="w-3.5 h-3.5" />
            <span>Figma Canvas Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Built For Speed & Collaboration</h2>
          <p className="text-xs sm:text-sm text-gray-400">Manage your entire restaurant menu inside a clean, visual canvas interface.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="bg-[#101018] border border-purple-500/20 p-8 rounded-3xl space-y-4 hover:border-purple-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Auto Layout Frames</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Responsive menu categories and food item frames that adjust automatically on mobile screens.
            </p>
          </div>

          <div className="bg-[#101018] border border-purple-500/20 p-8 rounded-3xl space-y-4 hover:border-purple-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Multiplayer Real-Time Sync</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Mark dishes as "SOLD OUT" or update prices, and it syncs live across all table QR screens instantly.
            </p>
          </div>

          <div className="bg-[#101018] border border-purple-500/20 p-8 rounded-3xl space-y-4 hover:border-purple-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Table QR Components</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Reusable QR code components for Table 1 to 50 that link directly to specific dining tables.
            </p>
          </div>

          <div className="bg-[#101018] border border-purple-500/20 p-8 rounded-3xl space-y-4 hover:border-purple-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Inspector Analytics</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Track daily menu scan heatmaps, unique visitor trends, and top-ordered dishes in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* 4. WORKFLOW PIPELINE */}
      <section id="workflow" className="py-24 bg-[#0A0A10] border-y border-purple-500/20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Design to Production Pipeline</h2>
            <p className="text-xs sm:text-sm text-gray-400">Launch your digital menu in 3 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-[#12121C] border border-purple-500/20 p-8 rounded-3xl space-y-4 relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Craft Components</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Add food items, upload mouthwatering photos, set prices, and toggle veg/non-veg tags.
              </p>
            </div>

            <div className="bg-[#12121C] border border-purple-500/20 p-8 rounded-3xl space-y-4 relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-amber-500 text-white font-extrabold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Map Table Layout</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Generate unique table QR tokens (Table 1 to 50) for your restaurant dining layout.
              </p>
            </div>

            <div className="bg-[#12121C] border border-purple-500/20 p-8 rounded-3xl space-y-4 relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 text-white font-extrabold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-white">One-Click Export</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Print high-resolution vector QR cards directly and place them on your dining tables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING TIERS */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Studio Pricing Plans</h2>
          <p className="text-xs sm:text-sm text-gray-400">Choose the plan for your restaurant layout.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {/* BASIC PLAN */}
          <div className="bg-[#101018] border border-purple-500/30 p-8 rounded-3xl space-y-6 flex flex-col justify-between hover:border-purple-400 transition-all">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Basic Restaurant</h3>
              <p className="text-xs text-gray-400">Essential digital QR menu setup for cafes & small dining spots.</p>
              
              <div className="grid grid-cols-2 rounded-2xl bg-[#08080C] border border-purple-500/20 divide-x divide-purple-500/20 overflow-hidden">
                <div className="p-3 text-center space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 block">6 MONTHS</span>
                  <span className="text-xl font-black text-white block">₹2,499</span>
                </div>
                <div className="p-3 text-center space-y-1 bg-purple-500/10">
                  <span className="text-[10px] font-bold text-amber-400 block">LIFETIME</span>
                  <span className="text-xl font-black text-amber-400 block">₹9,999</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-gray-300 pt-4 border-t border-purple-500/20">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>1 Digital Restaurant Menu</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Unlimited Dishes & Categories</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Instant SOLD OUT Toggle Switch</span>
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
          <div className="bg-[#101018] border-2 border-purple-500 p-8 rounded-3xl space-y-6 flex flex-col justify-between relative shadow-2xl shadow-purple-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider">
              PRO ENTERPRISE CANVASES
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Premium Restaurant</h3>
              <p className="text-xs text-gray-400">Complete QR platform with Figma studio & table management.</p>
              
              <div className="grid grid-cols-2 rounded-2xl bg-[#08080C] border border-purple-500/30 divide-x divide-purple-500/30 overflow-hidden">
                <div className="p-3 text-center space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 block">6 MONTHS</span>
                  <span className="text-xl font-black text-white block">₹5,999</span>
                </div>
                <div className="p-3 text-center space-y-1 bg-purple-500/20">
                  <span className="text-[10px] font-bold text-amber-400 block">LIFETIME</span>
                  <span className="text-xl font-black text-amber-400 block">₹24,999</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-gray-300 pt-4 border-t border-purple-500/20">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Everything in Basic Plan</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Table-Specific QR Codes (Table 1-25)</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Call Waiter & Bill Request Alerts</span>
                </li>
              </ul>
            </div>

            <Link
              to="/signup"
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-amber-500 text-white font-extrabold text-xs transition-all hover:opacity-90 text-center block shadow-lg"
            >
              Get Premium Plan
            </Link>
          </div>
        </div>
      </section>

      {/* 6. WHATSAPP & STUDIO SUPPORT */}
      <section id="contact" className="py-24 bg-[#050507] border-t border-purple-500/20 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/30">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Need Help Setup Your Canvas?
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
            Our team will configure your restaurant menu and table QR codes within 5 minutes.
          </p>
          <a
            href="https://wa.me/919876543210?text=Hi%20FlashMenu%20Studio%20Team,%20I%20want%20to%20setup%20my%20Figma%20QR%20menu!"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all shadow-xl"
          >
            <MessageCircle className="w-5 h-5 fill-black" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
