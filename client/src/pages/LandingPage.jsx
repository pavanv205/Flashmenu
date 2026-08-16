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
      a: 'Yes! FlashMenu allows you to create table-specific QR codes (e.g., Table 1 to 50). When scanned, the customer menu knows their exact table number.',
    },
    {
      q: 'How fast does the menu load on customer phones?',
      a: 'FlashMenu is built for extreme speed. Public menus load in under 1 second even on 3G mobile networks, using optimized assets and lightweight code.',
    },
    {
      q: 'Can customers request a waiter or water from their phone?',
      a: 'Yes, FlashMenu includes a built-in "Call Waiter" feature where customers can tap to request water, their bill, or staff assistance directly from their table.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-gray-800/60">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-extrabold uppercase tracking-widest">
            <Zap className="w-4 h-4 text-brand-500 fill-brand-500" />
            <span>Next-Gen QR Menu Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-sans leading-tight">
            Flash<span className="gold-gradient-text">Menu</span> — <br />
            <span className="text-white">Scan. See. Dine.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Turn your restaurant menu into a fast, beautiful digital experience. Customers scan your table QR code and instantly view your menu on their phones — zero downloads or signups required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-2">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-400 hover:from-brand-400 hover:to-brand-300 text-black font-extrabold text-base shadow-xl shadow-brand-500/25 transition-all hover:scale-105"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/menu/spice-garden"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-dark-card border border-gray-700 hover:border-brand-500/50 text-white font-bold text-base transition-all hover:bg-dark-hover"
            >
              <QrCode className="w-5 h-5 text-brand-400" />
              <span>View Live Demo</span>
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="pt-10 border-t border-gray-800/80 grid grid-cols-3 gap-6 text-center max-w-2xl mx-auto">
            <div>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-white">100%</h4>
              <p className="text-xs text-gray-400 font-medium">No App Download</p>
            </div>
            <div>
              <h4 className="text-2xl sm:text-3xl font-extrabold gold-gradient-text">&lt; 1s</h4>
              <p className="text-xs text-gray-400 font-medium">Lightning Scan Speed</p>
            </div>
            <div>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-white">Instant</h4>
              <p className="text-xs text-gray-400 font-medium">Sold Out Toggle</p>
            </div>
          </div>
        </div>
      </section>

      {/* How FlashMenu Works */}
      <section className="py-20 bg-[#0E1420] border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-extrabold text-brand-400 uppercase tracking-widest">3 Simple Steps</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">How FlashMenu Works</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Set up your restaurant in under 5 minutes and offer your diners a premium contactless menu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark-card border border-dark-border p-8 rounded-3xl relative hover:border-brand-500/40 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-extrabold text-xl mb-6 border border-brand-500/20 group-hover:bg-brand-500 group-hover:text-black transition-all">
                01
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Create Your Menu</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Add categories, food photos, prices, dietary badges (veg/non-veg), and spicy levels easily with drag & drop reordering.
              </p>
            </div>

            <div className="bg-dark-card border border-dark-border p-8 rounded-3xl relative hover:border-brand-500/40 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-extrabold text-xl mb-6 border border-brand-500/20 group-hover:bg-brand-500 group-hover:text-black transition-all">
                02
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Place Table QR Codes</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Download high-res printable QR cards customized for each table and place them on your dining tables or standees.
              </p>
            </div>

            <div className="bg-dark-card border border-dark-border p-8 rounded-3xl relative hover:border-brand-500/40 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-extrabold text-xl mb-6 border border-brand-500/20 group-hover:bg-brand-500 group-hover:text-black transition-all">
                03
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Customers Scan & View</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Diners scan with any camera app. The menu opens immediately in their mobile browser with instant category search.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-extrabold text-brand-400 uppercase tracking-widest">Built For Restaurants</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Everything You Need To Flourish</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Table-Specific QRs</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Generate unique QR codes for Table 1 to 50 so you always know where orders and waiter calls originate.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Instant Sold-Out Toggle</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Run out of an ingredient? Mark dishes as SOLD OUT instantly without reprinting paper menus.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Menu Analytics</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Track daily menu scans, unique visitors, peak dining hours, and your most popular dishes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
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

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#0E1420] border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-extrabold text-brand-400 uppercase tracking-widest">Flexible Plans</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Simple, Transparent Pricing</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="p-8 rounded-3xl bg-dark-card border border-dark-border space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-white">Free Starter</h4>
                <div className="text-3xl font-black text-white">₹0 <span className="text-xs text-gray-400 font-normal">/ forever</span></div>
                <p className="text-xs text-gray-400">Perfect for small cafes and food trucks getting started with digital menus.</p>
                <ul className="space-y-3 text-xs text-gray-300 pt-4 border-t border-dark-border">
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> <span>1 Restaurant Menu</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> <span>Up to 30 Menu Items</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> <span>Standard Master QR Code</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> <span>Instant Sold-Out Toggle</span></li>
                </ul>
              </div>
              <Link to="/signup" className="w-full py-3 rounded-xl bg-dark-hover border border-dark-border text-center font-bold text-sm text-white hover:border-brand-500">
                Get Started Free
              </Link>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-dark-card to-[#172238] border-2 border-brand-500 space-y-6 flex flex-col justify-between relative gold-glow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-500 text-black text-[11px] font-black uppercase tracking-wider">
                Most Popular
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-white">Pro Restaurant</h4>
                <div className="text-3xl font-black text-white">₹999 <span className="text-xs text-gray-400 font-normal">/ month</span></div>
                <p className="text-xs text-gray-300">Complete suite for growing restaurants, bars, and fine dining establishments.</p>
                <ul className="space-y-3 text-xs text-gray-200 pt-4 border-t border-dark-border">
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-brand-400" /> <span>Unlimited Menu Items & Categories</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-brand-400" /> <span>Table-Specific QR Codes (1..50)</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-brand-400" /> <span>Real-time Menu Analytics</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-brand-400" /> <span>Call Waiter & Feedback System</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-brand-400" /> <span>Custom Branding & Colors</span></li>
                </ul>
              </div>
              <Link to="/signup" className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-center font-extrabold text-sm text-black shadow-lg shadow-brand-500/20">
                Start Pro Trial
              </Link>
            </div>

            {/* Business */}
            <div className="p-8 rounded-3xl bg-dark-card border border-dark-border space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-white">Enterprise / Chain</h4>
                <div className="text-3xl font-black text-white">₹2,499 <span className="text-xs text-gray-400 font-normal">/ month</span></div>
                <p className="text-xs text-gray-400">Multi-branch management with advanced analytics and dedicated support.</p>
                <ul className="space-y-3 text-xs text-gray-300 pt-4 border-t border-dark-border">
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> <span>Multiple Restaurant Locations</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> <span>Online Table Ordering System</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> <span>Dedicated Account Manager</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> <span>POS & ERP API Integration</span></li>
                </ul>
              </div>
              <Link to="/signup" className="w-full py-3 rounded-xl bg-dark-hover border border-dark-border text-center font-bold text-sm text-white hover:border-brand-500">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 border-b border-gray-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-xs font-extrabold text-brand-400 uppercase tracking-widest">Questions & Answers</h2>
            <h3 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left font-bold text-white flex items-center justify-between hover:text-brand-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === idx ? 'rotate-180 text-brand-400' : 'text-gray-400'}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-gray-400 leading-relaxed border-t border-dark-border/50 pt-4">
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
