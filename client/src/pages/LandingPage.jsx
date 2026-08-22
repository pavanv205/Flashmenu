import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import {
  Zap,
  QrCode,
  Smartphone,
  CheckCircle,
  BarChart2,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Crown,
} from 'lucide-react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'Do customers need to download an app or log in?',
      a: 'No! That is the magic of FlashMenu. Customers simply open their phone camera, scan the table QR code, and your menu opens instantly in any browser.',
    },
    {
      q: 'What happens when an item is sold out?',
      a: 'You can instantly toggle any item as "SOLD OUT" from your restaurant dashboard. It immediately shows a clear "SOLD OUT" badge on the digital menu without needing to reprint anything.',
    },
    {
      q: 'Can I generate unique QR codes for each table?',
      a: 'Yes! Premium Restaurant plan allows you to create table-specific QR codes (e.g., Table 1 to 50). When scanned, the customer menu knows their exact table number.',
    },
    {
      q: 'How fast does the menu load on customer phones?',
      a: 'FlashMenu is built for extreme speed. Public menus load in under 1 second even on 3G mobile networks, using optimized assets and lightweight code.',
    },
    {
      q: 'Can customers request a waiter or water from their phone?',
      a: 'Yes, Premium Restaurant plan includes a built-in "Call Waiter" feature where customers can tap to request water, their bill, or staff assistance directly from their table.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#08080A] text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section id="about" className="relative pt-24 pb-28 overflow-hidden border-b border-white/[0.08]">
        {/* Ambient Minimal Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-amber-500/10 via-transparent to-white/5 rounded-full blur-[170px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08]">
            Flash<span className="gold-gradient-text">Menu</span> <br />
            <span className="text-white">Scan Tap Dine</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Turn your restaurant menu into a fast, beautiful digital experience
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-black font-extrabold text-sm transition-all hover:bg-gray-200 shadow-xl"
            >
              <span>Get Started</span>
            </Link>

            <a
              href="https://wa.me/916301592025?text=Hello%20FlashMenu!%20I%20would%20like%20to%20book%20a%20live%20demo%20for%20my%20restaurant."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-transparent border border-white/20 text-white font-bold text-sm transition-all hover:bg-white/10"
            >
              <span>Book a Demo</span>
            </a>
          </div>

          {/* Realistic Product Mockup Showcase */}
          <div className="pt-8 max-w-2xl mx-auto relative">
            <div className="relative">
              <img
                src="/hero_showcase.png"
                alt="FlashMenu QR Code Standee and Live Mobile App Interface"
                className="w-full h-auto object-contain hover:scale-[1.01] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW FLASHMENU WORKS */}
      <section id="how-it-works" className="py-24 bg-[#0A0A0E] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest">3 Simple Steps</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">How FlashMenu Works</h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              Set up your restaurant in under 5 minutes and offer your diners a premium contactless menu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="minimal-card p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 text-white flex items-center justify-center font-extrabold text-lg">
                01
              </div>
              <h4 className="text-xl font-bold text-white">Create Your Menu</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Add categories, food photos, prices, dietary badges (veg/non-veg), and spicy levels easily with drag & drop reordering.
              </p>
            </div>

            <div className="minimal-card p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 text-white flex items-center justify-center font-extrabold text-lg">
                02
              </div>
              <h4 className="text-xl font-bold text-white">Place Table QR Codes</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Download high-res printable QR cards customized for each table and place them on your dining tables or standees.
              </p>
            </div>

            <div className="minimal-card p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 text-white flex items-center justify-center font-extrabold text-lg">
                03
              </div>
              <h4 className="text-xl font-bold text-white">Customers Scan & View</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Diners scan with any camera app. The menu opens immediately in their mobile browser with instant category search.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES GRID */}
      <section id="features" className="py-24 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest">Built For Restaurants</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Everything You Need To Flourish</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="minimal-card p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] text-amber-400 flex items-center justify-center border border-white/10">
                <QrCode className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Table-Specific QRs</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Generate unique QR codes for Table 1 to 50 so you always know where orders and waiter calls originate.
              </p>
            </div>

            <div className="minimal-card p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] text-amber-400 flex items-center justify-center border border-white/10">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Instant Sold-Out Toggle</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Run out of an ingredient? Mark dishes as SOLD OUT instantly without reprinting paper menus.
              </p>
            </div>

            <div className="minimal-card p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] text-amber-400 flex items-center justify-center border border-white/10">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Menu Analytics</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Track daily menu scans, unique visitors, peak dining hours, and your most popular dishes.
              </p>
            </div>

            <div className="minimal-card p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] text-amber-400 flex items-center justify-center border border-white/10">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Call Waiter Button</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Allow customers to request water, their check, or waiter assistance right from their mobile browser.
              </p>
            </div>
          </div>
        </div>
      </section>



      <Footer />
    </div>
  );
}
