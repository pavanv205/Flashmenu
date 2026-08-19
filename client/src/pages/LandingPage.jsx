import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Sparkles,
  Bot,
  Wand2,
  Cpu,
  Layers,
  QrCode,
  Smartphone,
  Zap,
  CheckCircle,
  BarChart2,
  ArrowRight,
  RefreshCw,
  Check,
  MessageCircle,
  Sliders,
  Image as ImageIcon,
} from 'lucide-react';

export default function LandingPage() {
  // Live AI Prompt Playground State
  const [promptText, setPromptText] = useState('Artisanal Bistro & Fine Dining');
  const [selectedTheme, setSelectedTheme] = useState('midnight');
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample Generated Output State based on Prompt
  const promptPresets = [
    { title: 'Artisanal Bistro & Fine Dining', theme: 'midnight' },
    { title: 'Tokyo Ramen & Sushi Bar', theme: 'cyber' },
    { title: 'South Indian Tiffin House', theme: 'amber' },
    { title: 'Sleek Cocktail Lounge & Tapas', theme: 'purple' },
  ];

  const themeStyles = {
    midnight: {
      bg: 'bg-[#0F131F]',
      border: 'border-indigo-500/40',
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      accent: 'text-indigo-400',
    },
    cyber: {
      bg: 'bg-[#09151A]',
      border: 'border-cyan-500/40',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      accent: 'text-cyan-400',
    },
    amber: {
      bg: 'bg-[#181109]',
      border: 'border-amber-500/40',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      accent: 'text-amber-400',
    },
    purple: {
      bg: 'bg-[#140B1E]',
      border: 'border-purple-500/40',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      accent: 'text-purple-400',
    },
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#060709] text-white flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* 1. STITCH AI HERO SECTION */}
      <section className="relative pt-20 pb-24 overflow-hidden text-center border-b border-indigo-500/20">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          {/* AI Partner Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-amber-500/10 border border-indigo-500/30 shadow-lg">
            <Sparkles className="w-4 h-4 text-indigo-400 fill-indigo-400 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-amber-300">
              STITCH AI ENGINE • GOOGLE LABS INTEGRATION
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
            AI-Powered Digital Menus. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-400">
              Generated in Seconds with Stitch.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transform paper menus or raw dish ideas into stunning, interactive QR menus using Google Gemini & Stitch AI design capabilities.
          </p>

          {/* Interactive AI Prompt Input Bar */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="bg-[#0D0F17]/90 border border-indigo-500/30 p-2 sm:p-3 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center space-x-2 px-3 w-full sm:w-auto flex-1">
                <Wand2 className="w-5 h-5 text-indigo-400 shrink-0" />
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Type cuisine (e.g. Italian Bistro, Sushi Bar...)"
                  className="bg-transparent text-white text-xs sm:text-sm focus:outline-none w-full placeholder-gray-500 font-medium"
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-amber-500 text-white font-extrabold text-xs transition-all hover:scale-105 shadow-xl shadow-indigo-500/25 flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Stitching Menu...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white" />
                    <span>Generate AI Menu</span>
                  </>
                )}
              </button>
            </div>

            {/* Prompt Presets Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              <span className="text-[11px] text-gray-400 font-semibold mr-1">Try AI Prompts:</span>
              {promptPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptText(preset.title);
                    setSelectedTheme(preset.theme);
                    handleGenerate();
                  }}
                  className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-400 text-gray-300 hover:text-white text-[11px] font-medium transition-all"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE INTERACTIVE STITCH AI PLAYGROUND / PREVIEW WIDGET */}
      <section id="ai-generator" className="py-20 bg-[#040507] border-b border-indigo-500/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              <span>Real-Time Neural Preview</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Stitch AI Live Preview Canvas</h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
              Watch Stitch AI dynamically compose food items, pricing tiers, and dietary badges for <span className="text-indigo-400 font-bold">"{promptText}"</span>.
            </p>
          </div>

          {/* Canvas Box */}
          <div className="bg-[#0B0D14] border border-indigo-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
              
              {/* Left Control Column */}
              <div className="space-y-6 w-full lg:w-1/3 text-left">
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-indigo-400 tracking-wider">Active Prompt</span>
                  <div className="p-3.5 rounded-2xl bg-[#060709] border border-indigo-500/20 text-xs font-mono text-indigo-200">
                    "{promptText}"
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Stitch UI Theme Palette</span>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(themeStyles).map((tKey) => (
                      <button
                        key={tKey}
                        onClick={() => setSelectedTheme(tKey)}
                        className={`p-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all text-center ${
                          selectedTheme === tKey
                            ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-lg'
                            : 'bg-[#060709] border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {tKey}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold">
                    <Bot className="w-4 h-4 text-indigo-400" />
                    <span>Gemini 2.0 Flash Verification</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Auto-generated dietary flags (Veg / Non-Veg / Vegan / Gluten Free) & caloric estimates applied automatically.
                  </p>
                </div>
              </div>

              {/* Right Live Mobile Menu Output */}
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className={`w-full max-w-sm rounded-[36px] p-4 border-2 shadow-2xl transition-all duration-500 ${themeStyles[selectedTheme].bg} ${themeStyles[selectedTheme].border}`}>
                  <div className="w-16 h-1 bg-gray-800 rounded-full mx-auto mb-3" />

                  {/* Header inside mobile preview */}
                  <div className="text-left space-y-2 pb-3 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-white">{promptText}</h4>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${themeStyles[selectedTheme].badge}`}>
                        STITCH AI MENU
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">Scan to order at Table #04 • Powered by FlashMenu</p>
                  </div>

                  {/* Food Items Generated */}
                  <div className="space-y-2.5 pt-3 text-left">
                    <div className="p-3 rounded-2xl bg-[#05060A]/80 border border-white/10 flex items-center justify-between hover:border-indigo-500/40 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <p className="text-xs font-bold text-white">Truffle Wild Mushroom Risotto</p>
                        </div>
                        <p className="text-[10px] text-gray-400">Arborio rice, porcini dust, shaved parmesan</p>
                        <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">VEGETARIAN</span>
                      </div>
                      <span className={`text-xs font-extrabold ${themeStyles[selectedTheme].accent}`}>₹420</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#05060A]/80 border border-white/10 flex items-center justify-between hover:border-indigo-500/40 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-red-400" />
                          <p className="text-xs font-bold text-white">Flame-Grilled Salmon Fillet</p>
                        </div>
                        <p className="text-[10px] text-gray-400">Lemon butter glaze, asparagus spears</p>
                        <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">BEST SELLER</span>
                      </div>
                      <span className={`text-xs font-extrabold ${themeStyles[selectedTheme].accent}`}>₹680</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#05060A]/80 border border-white/10 flex items-center justify-between hover:border-indigo-500/40 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <p className="text-xs font-bold text-white">Artisanal Match Parfait</p>
                        </div>
                        <p className="text-[10px] text-gray-400">Matcha cream, candied ginger crumble</p>
                        <span className="text-[9px] text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded">CHEF SPECIAL</span>
                      </div>
                      <span className={`text-xs font-extrabold ${themeStyles[selectedTheme].accent}`}>₹290</span>
                    </div>
                  </div>

                  {/* Bottom Action inside preview */}
                  <div className="pt-4 text-center">
                    <Link
                      to="/signup"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-amber-500 text-white font-extrabold text-xs block text-center shadow-lg"
                    >
                      Publish This AI Menu &rarr;
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE STITCH AI CAPABILITIES */}
      <section id="capabilities" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>AI Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Stitch AI Engine Features</h2>
          <p className="text-xs sm:text-sm text-gray-400">Everything needed to run a next-generation digital menu system.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="bg-[#0B0D14] border border-indigo-500/20 p-8 rounded-3xl space-y-4 hover:border-indigo-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Wand2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Instant Prompt Parsing</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Upload paper PDFs or type dish prompts. Gemini Flash 2.0 extracts categories and prices automatically.
            </p>
          </div>

          <div className="bg-[#0B0D14] border border-indigo-500/20 p-8 rounded-3xl space-y-4 hover:border-indigo-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Adaptive Stitch UI</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Dynamic color palettes, typography, and card layouts that adjust automatically for fast customer loading.
            </p>
          </div>

          <div className="bg-[#0B0D14] border border-indigo-500/20 p-8 rounded-3xl space-y-4 hover:border-indigo-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Generative Food Photos</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              AI creates high-resolution visual previews for dishes so customers can visualize every food item.
            </p>
          </div>

          <div className="bg-[#0B0D14] border border-indigo-500/20 p-8 rounded-3xl space-y-4 hover:border-indigo-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Predictive Analytics</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Track table QR scans, customer demand trends, and peak dining hours with real-time AI dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS / 3-STEP PIPELINE */}
      <section id="how-it-works" className="py-24 bg-[#040507] border-y border-indigo-500/20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">The 3-Step AI Pipeline</h2>
            <p className="text-xs sm:text-sm text-gray-400">Launch your digital menu in under 2 minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-[#0B0D14] border border-indigo-500/20 p-8 rounded-3xl space-y-4 relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Prompt or Upload</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Drop your existing paper menu PDF or type your restaurant concept into the Stitch AI Prompt Studio.
              </p>
            </div>

            <div className="bg-[#0B0D14] border border-indigo-500/20 p-8 rounded-3xl space-y-4 relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-amber-500 text-white font-extrabold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Gemini Flash Processing</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                AI parses categories, translates languages, assigns dietary tags (veg/non-veg) & formats pricing.
              </p>
            </div>

            <div className="bg-[#0B0D14] border border-indigo-500/20 p-8 rounded-3xl space-y-4 relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 text-white font-extrabold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Publish Table QRs</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Download printable high-res table QR cards (Table 1 to 50) ready for dining tables immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING TIERS */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Select Restaurant Tier</h2>
          <p className="text-xs sm:text-sm text-gray-400">Includes full Stitch AI engine access & instant QR code menu setup.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {/* BASIC PLAN */}
          <div className="bg-[#0B0D14] border border-indigo-500/30 p-8 rounded-3xl space-y-6 flex flex-col justify-between hover:border-indigo-400 transition-all">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Basic Restaurant</h3>
              <p className="text-xs text-gray-400">Essential digital QR menu setup for cafes & small dining spots.</p>
              
              <div className="grid grid-cols-2 rounded-2xl bg-[#060709] border border-indigo-500/20 divide-x divide-indigo-500/20 overflow-hidden">
                <div className="p-3 text-center space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 block">6 MONTHS</span>
                  <span className="text-xl font-black text-white block">₹2,499</span>
                </div>
                <div className="p-3 text-center space-y-1 bg-indigo-500/10">
                  <span className="text-[10px] font-bold text-amber-400 block">LIFETIME</span>
                  <span className="text-xl font-black text-amber-400 block">₹9,999</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-gray-300 pt-4 border-t border-indigo-500/20">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>1 Digital Restaurant Menu</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Unlimited Dishes & Categories</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
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
          <div className="bg-[#0B0D14] border-2 border-indigo-500 p-8 rounded-3xl space-y-6 flex flex-col justify-between relative shadow-2xl shadow-indigo-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider">
              RECOMMENDED PRO TIER
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Premium Restaurant</h3>
              <p className="text-xs text-gray-400">Complete QR platform with Stitch AI studio & table management.</p>
              
              <div className="grid grid-cols-2 rounded-2xl bg-[#060709] border border-indigo-500/30 divide-x divide-indigo-500/30 overflow-hidden">
                <div className="p-3 text-center space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 block">6 MONTHS</span>
                  <span className="text-xl font-black text-white block">₹5,999</span>
                </div>
                <div className="p-3 text-center space-y-1 bg-indigo-500/20">
                  <span className="text-[10px] font-bold text-amber-400 block">LIFETIME</span>
                  <span className="text-xl font-black text-amber-400 block">₹24,999</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-gray-300 pt-4 border-t border-indigo-500/20">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Everything in Basic Plan</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Table-Specific QR Codes (Table 1-25)</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Call Waiter & Bill Request Alerts</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Stitch AI Dish Generator Access</span>
                </li>
              </ul>
            </div>

            <Link
              to="/signup"
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-amber-500 text-white font-extrabold text-xs transition-all hover:opacity-90 text-center block shadow-lg"
            >
              Get Premium AI Plan
            </Link>
          </div>
        </div>
      </section>

      {/* 6. AI STUDIO CONTACT / WHATSAPP */}
      <section className="py-24 bg-[#040507] border-t border-indigo-500/20 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Need Custom AI Menu Setup?
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
            Our team will configure Stitch AI and import your existing paper menu within 10 minutes.
          </p>
          <a
            href="https://wa.me/919876543210?text=Hi%20FlashMenu%20Stitch%20AI%20Team,%20I%20want%20to%20setup%20my%20restaurant%20menu!"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all shadow-xl"
          >
            <MessageCircle className="w-5 h-5 fill-black" />
            <span>Chat with AI Setup Specialist</span>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
