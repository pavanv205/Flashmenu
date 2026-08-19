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
            Turn your restaurant menu into a fast, beautiful digital experience. Customers scan your table QR code and instantly view your menu on their phones — zero downloads or signups required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <Link
              to="/menu/spice-garden"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-black font-extrabold text-sm transition-all hover:bg-gray-200 shadow-xl"
            >
              <span>Book a Demo</span>
            </Link>

            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-transparent border border-white/20 text-white font-bold text-sm transition-all hover:bg-white/10"
            >
              <span>Get Started</span>
            </Link>
          </div>

          {/* Realistic Product Mockup Showcase */}
          <div className="pt-8 max-w-2xl mx-auto relative">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-white/5 rounded-3xl blur-2xl pointer-events-none" />

            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#08080A]">
              <img
                src="/mockup_preview.png"
                alt="FlashMenu QR Code Standee and Live Mobile App Interface"
                className="w-full h-auto object-cover rounded-3xl brightness-[0.85] contrast-[1.05] hover:brightness-100 transition-all duration-500"
              />
              {/* Subtle Ambient Blend Vignette */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#08080A]/60 via-transparent to-transparent rounded-3xl" />
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

      {/* 4. PRICING SECTION */}
      <section id="pricing" className="py-24 border-b border-white/[0.08] bg-[#0A0A0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest">Simple Transparent Pricing</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Choose Your Restaurant Plan</h3>
            <p className="text-xs sm:text-sm text-gray-400">
              No hidden fees. Full digital menu setup with instant QR code ordering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* CARD 1: BASIC RESTAURANT */}
            <div className="minimal-card p-8 rounded-3xl relative flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Standard Tier</span>
                </div>
                <h4 className="text-2xl font-extrabold text-white">Basic Restaurant</h4>
                <p className="text-xs text-gray-400">Essential digital QR menu setup for cafes & small dining spots.</p>
                
                {/* Durations */}
                <div className="grid grid-cols-2 rounded-2xl bg-[#060608] border border-white/10 divide-x divide-white/10 overflow-hidden">
                  <div className="p-3 text-center space-y-1">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">6 MONTHS</span>
                    <span className="text-xl font-black text-white block">₹2,499</span>
                    <Link
                      to="/signup"
                      className="w-full py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black text-[10px] font-extrabold transition-all border border-amber-500/30 block mt-1"
                    >
                      Demo Pay ₹2,499
                    </Link>
                  </div>
                  <div className="p-3 text-center space-y-1 bg-amber-500/5">
                    <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">LIFETIME</span>
                    <span className="text-xl font-black text-amber-400 block">₹9,999</span>
                    <Link
                      to="/signup"
                      className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black transition-all block mt-1 shadow-sm"
                    >
                      Demo Pay ₹9,999
                    </Link>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-gray-300 pt-4 border-t border-white/10">
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>1 Digital Restaurant Menu</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Unlimited Dishes & Categories</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>High-Resolution Master Table QR Code</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Instant SOLD OUT Toggle Switch</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Fast Mobile Customer View</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/signup"
                className="w-full py-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-extrabold text-xs transition-all text-center block border border-white/10"
              >
                Get Started with Basic &rarr;
              </Link>
            </div>

            {/* CARD 2: PREMIUM RESTAURANT */}
            <div className="bg-[#0E0E14] border-2 border-amber-500 p-8 rounded-3xl relative flex flex-col justify-between space-y-6 gold-glow">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-black text-[11px] font-black uppercase tracking-wider flex items-center space-x-1 shadow-lg">
                <Crown className="w-3.5 h-3.5 text-black fill-black" />
                <span>Recommended</span>
              </div>

              <div className="space-y-4 pt-1">
                <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Full Pro Suite</span>
                </div>
                <h4 className="text-2xl font-extrabold text-white">Premium Restaurant</h4>
                <p className="text-xs text-gray-300">Complete QR platform for busy restaurants & fine dining.</p>
                
                {/* Durations */}
                <div className="grid grid-cols-2 rounded-2xl bg-[#060608] border border-amber-500/30 divide-x divide-amber-500/30 overflow-hidden">
                  <div className="p-3 text-center space-y-1">
                    <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest block">6 MONTHS</span>
                    <span className="text-xl font-black text-white block">₹5,999</span>
                    <Link
                      to="/signup"
                      className="w-full py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black text-[10px] font-extrabold transition-all border border-amber-500/30 block mt-1"
                    >
                      Demo Pay ₹5,999
                    </Link>
                  </div>
                  <div className="p-3 text-center space-y-1 bg-amber-500/10">
                    <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">LIFETIME</span>
                    <span className="text-xl font-black text-amber-400 block">₹24,999</span>
                    <Link
                      to="/signup"
                      className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black transition-all block mt-1 shadow-sm"
                    >
                      Demo Pay ₹24,999
                    </Link>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-gray-200 pt-4 border-t border-amber-500/20">
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Everything in Basic Plan</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Table-Specific QR Codes (Table 1 to 25)</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Real-Time Table Ordering & Kitchen Display</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Call Waiter & Bill Request Alerts</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Customer Feedback & Rating System</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/signup"
                className="w-full py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all text-center block shadow-lg shadow-amber-500/20"
              >
                Get Premium Restaurant &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section id="faq" className="py-24 border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest">Questions & Answers</h2>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="minimal-card rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left font-bold text-white text-sm flex items-center justify-between hover:text-amber-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === idx ? 'rotate-180 text-amber-400' : 'text-gray-400'}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-xs text-gray-400 leading-relaxed border-t border-white/[0.06] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
