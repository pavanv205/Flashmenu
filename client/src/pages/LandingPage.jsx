import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Zap,
  QrCode,
  Smartphone,
  CheckCircle,
  TrendingUp,
  BarChart2,
  Globe,
  Layers,
  ArrowRight,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Crown,
  Bell,
  CreditCard,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'Do customers need to download an app or log in?',
      a: 'No! Customers simply scan the table QR code with any phone camera. Your menu opens instantly in their web browser — zero app downloads or account signups required.',
    },
    {
      q: 'What happens when a menu item is sold out?',
      a: 'You can instantly toggle any item as "SOLD OUT" from your FlashMenu dashboard. It updates in real time on all customer phones without reprinting paper menus.',
    },
    {
      q: 'Can I generate unique QR codes for each table?',
      a: 'Yes! The Premium Restaurant plan allows you to generate table-specific QR codes (e.g., Table 1 to 25). When scanned, orders and waiter requests automatically include the exact table number.',
    },
    {
      q: 'How fast does the menu load on mobile phones?',
      a: 'FlashMenu is engineered for extreme speed. Digital menus load in under 1 second even on 3G mobile connections.',
    },
    {
      q: 'How do Razorpay & UPI demo payments work?',
      a: 'FlashMenu integrates directly with Razorpay and UPI QR codes, allowing seamless subscription activations and customer bill settlements.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-gray-800/60">
        {/* Ambient background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-widest">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>India’s #1 QR Dining Solution</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight font-sans leading-none">
            Transform Your Restaurant <br className="hidden sm:inline" />
            <span className="gold-gradient-text">With Smart QR Menus</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Sleek digital menus, instant customer ordering, staff call alerts, and real-time menu updates — zero app downloads required for your diners.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-black text-base shadow-xl shadow-amber-500/25 transition-all hover:scale-105"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/menu/spice-garden"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-dark-card border border-dark-border hover:border-amber-500/50 text-white font-bold text-base transition-all hover:bg-dark-hover"
            >
              <QrCode className="w-5 h-5 text-amber-400" />
              <span>Explore Live Demo Menu</span>
            </Link>
          </div>

          {/* Social Proof & Metrics */}
          <div className="pt-12 border-t border-dark-border/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-dark-card/40 border border-dark-border">
              <h4 className="text-2xl sm:text-3xl font-black text-white">&lt; 1s</h4>
              <p className="text-xs text-gray-400 font-medium mt-1">Scan Load Speed</p>
            </div>
            <div className="p-4 rounded-2xl bg-dark-card/40 border border-dark-border">
              <h4 className="text-2xl sm:text-3xl font-black gold-gradient-text">100%</h4>
              <p className="text-xs text-gray-400 font-medium mt-1">No App Download</p>
            </div>
            <div className="p-4 rounded-2xl bg-dark-card/40 border border-dark-border">
              <h4 className="text-2xl sm:text-3xl font-black text-white">Instant</h4>
              <p className="text-xs text-gray-400 font-medium mt-1">Sold Out Toggle</p>
            </div>
            <div className="p-4 rounded-2xl bg-dark-card/40 border border-dark-border">
              <h4 className="text-2xl sm:text-3xl font-black gold-gradient-text">Razorpay</h4>
              <p className="text-xs text-gray-400 font-medium mt-1">UPI & Card Ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-20 bg-[#0E1420] border-b border-gray-800/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest">The Future of Dining Is Here</h2>
          <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Redefine Your Dining Experience
          </h3>
          <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            FlashMenu replaces traditional paper menus and long waits with a sleek, lightning-fast digital platform that delights customers, speeds up order turnaround, and streamlines restaurant operations.
          </p>
        </div>
      </section>

      {/* WHAT WE OFFER (FEATURES GRID) */}
      <section className="py-24 border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest">What We Offer</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white">Everything You Need To Modernize</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              A comprehensive QR dining platform designed to elevate your brand and boost sales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-3xl bg-dark-card border border-dark-border hover:border-amber-500/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-all">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">QR-Based Menus</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Stunning, mobile-optimized digital menus that load instantly in any phone camera browser without requiring app downloads.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl bg-dark-card border border-dark-border hover:border-amber-500/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-all">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">Easy Ordering</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Diners can browse categories, filter by vegetarian/non-vegetarian, customize options, and submit orders directly from their phone.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-3xl bg-dark-card border border-dark-border hover:border-amber-500/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-all">
                <Bell className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">Call Waiter Button</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Customers tap to request water, their bill, or waiter assistance. Alerts instantly appear on your dashboard with exact table numbers.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-8 rounded-3xl bg-dark-card border border-dark-border hover:border-amber-500/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-all">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">Real-Time Analytics</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Gain insights into daily scan volume, popular dishes, peak dining hours, customer feedback, and total order revenue.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-8 rounded-3xl bg-dark-card border border-dark-border hover:border-amber-500/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-all">
                <CreditCard className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">Razorpay & UPI Payments</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Integrated support for Razorpay checkout, UPI QR codes (GPay, PhonePe, Paytm), and instant demo payment verification.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-8 rounded-3xl bg-dark-card border border-dark-border hover:border-amber-500/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-all">
                <Sliders className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">1-Click Menu Control</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Update prices, reorder food categories, add new seasonal specials, and mark out-of-stock items as SOLD OUT in 1 click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3 SIMPLE STEPS) */}
      <section className="py-24 bg-[#0E1420] border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest">3 Simple Steps</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white">How FlashMenu Works</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Set up your digital restaurant menu in under 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark-card border border-dark-border p-8 rounded-3xl relative hover:border-amber-500/40 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-extrabold text-xl mb-6 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-all">
                01
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Create Your Menu</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Add food categories, upload item photos, set prices, and select veg/non-veg tags with intuitive drag & drop controls.
              </p>
            </div>

            <div className="bg-dark-card border border-dark-border p-8 rounded-3xl relative hover:border-amber-500/40 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-extrabold text-xl mb-6 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-all">
                02
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Place Table QR Codes</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Download printable high-resolution QR codes customized for your restaurant tables, counters, or standees.
              </p>
            </div>

            <div className="bg-dark-card border border-dark-border p-8 rounded-3xl relative hover:border-amber-500/40 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-extrabold text-xl mb-6 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-all">
                03
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Customers Scan & Dine</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Diners scan with any mobile camera to view your digital menu, place table orders, and request waiter service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest">Transparent Pricing</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white">Choose Your Restaurant Plan</h3>
            <p className="text-xs sm:text-sm text-gray-400">
              No hidden charges. Full digital menu setup with instant QR code ordering and Razorpay demo payments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* CARD 1: BASIC RESTAURANT */}
            <div className="bg-dark-card border border-dark-border p-8 rounded-3xl relative hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Standard Tier</span>
                </div>
                <h4 className="text-2xl font-extrabold text-white">Basic Restaurant</h4>
                <p className="text-xs text-gray-400">Essential digital QR menu setup for cafes & small dining spots.</p>

                {/* Durations (Divided in Middle with Vertical Line) */}
                <div className="grid grid-cols-2 rounded-2xl bg-dark-base border border-dark-border divide-x divide-dark-border overflow-hidden">
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

                <ul className="space-y-3 text-xs text-gray-300 pt-4 border-t border-dark-border">
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
                </ul>
              </div>

              <Link
                to="/signup"
                className="w-full py-3.5 rounded-2xl bg-dark-base hover:bg-dark-hover border border-dark-border text-white font-extrabold text-xs transition-all text-center block"
              >
                Get Started with Basic &rarr;
              </Link>
            </div>

            {/* CARD 2: PREMIUM RESTAURANT */}
            <div className="bg-gradient-to-b from-dark-card via-[#162238] to-dark-card border-2 border-amber-500 p-8 rounded-3xl relative gold-glow flex flex-col justify-between space-y-6">
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

                {/* Durations (Divided in Middle with Vertical Line) */}
                <div className="grid grid-cols-2 rounded-2xl bg-dark-base border border-amber-500/30 divide-x divide-amber-500/30 overflow-hidden">
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
                </ul>
              </div>

              <Link
                to="/signup"
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all text-center block shadow-lg shadow-amber-500/20"
              >
                Get Premium Restaurant &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 border-b border-gray-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest">Questions & Answers</h2>
            <h3 className="text-3xl font-black text-white">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left font-bold text-white flex items-center justify-between hover:text-amber-400 transition-colors text-sm sm:text-base"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === idx ? 'rotate-180 text-amber-400' : 'text-gray-400'}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-dark-border/50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="py-20 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready To Transform Your Dining Experience?
          </h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Join hundreds of smart restaurants digitizing their menus with FlashMenu today.
          </p>
          <div className="pt-2">
            <Link
              to="/signup"
              className="inline-flex items-center space-x-3 px-10 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-base shadow-xl shadow-amber-500/25 transition-all hover:scale-105"
            >
              <span>Register Restaurant Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
