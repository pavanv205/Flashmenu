import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowLeft, Lock, FileText, ChevronRight } from 'lucide-react';
import FlashLogoBadge from '../components/FlashLogoBadge';
import Footer from '../components/Footer';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Privacy Policy | FlashMenu';
  }, []);

  return (
    <div className="min-h-screen bg-[#08080A] text-gray-100 font-sans selection:bg-amber-500 selection:text-black flex flex-col justify-between">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#08080A]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <FlashLogoBadge size="md" className="group-hover:scale-105 transition-transform" />
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                Flash<span className="gold-gradient-text">Menu</span>
              </span>
              <span className="block text-[10px] text-gray-400 tracking-widest font-bold uppercase -mt-1">
                Scan Tap Dine
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-xs font-bold text-gray-400 hover:text-amber-400 transition-colors bg-white/[0.05] px-4 py-2 rounded-full border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Privacy Document Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-8">
        {/* Document Header */}
        <div className="space-y-4 border-b border-white/[0.08] pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Legal & Privacy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Privacy Policy</h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium">Last Updated: August 2026</p>
        </div>

        {/* Intro */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 leading-relaxed text-sm text-gray-300">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Introduction & Scope</span>
          </h2>
          <p>
            Welcome to <strong>FlashMenu</strong> ("we," "our," or "us"). We are committed to protecting your privacy and handling your information securely and responsibly. This Privacy Policy explains how we collect, use, store, and protect information when you create a FlashMenu account, manage your restaurant profile, upload menu content, generate QR menus, or use our services.
          </p>
          <p>
            By creating an account or using FlashMenu, you acknowledge and agree to the practices described in this Privacy Policy.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">1</span>
            <span>Information We Collect</span>
          </h2>
          <p>We collect information necessary to provide and improve our digital restaurant menu services, including:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li><strong>Account Information:</strong> Full name, email address, password, and account details provided during registration.</li>
            <li><strong>Restaurant Information:</strong> Restaurant name, address, contact details, restaurant description, and other business information you choose to provide.</li>
            <li><strong>Menu Content:</strong> Food and beverage names, categories, descriptions, prices, availability, and other menu-related information.</li>
            <li><strong>Images & Uploads:</strong> Images of food items, restaurant logos, and other images uploaded to your FlashMenu account.</li>
            <li><strong>Technical Information:</strong> Basic information required to operate, maintain, secure, and improve our services.</li>
            <li><strong>Communication Information:</strong> Information you provide when contacting FlashMenu for support or assistance.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/[0.08]">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">2</span>
            <span>How We Use Your Information</span>
          </h2>
          <p>We use your information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>To create and manage your FlashMenu account.</li>
            <li>To create, display, and manage your restaurant's digital menu.</li>
            <li>To generate and provide QR-based access to your restaurant menu.</li>
            <li>To display restaurant and menu information to customers when they access your public menu.</li>
            <li>To securely store and manage uploaded menu images and content.</li>
            <li>To provide customer support and respond to your questions.</li>
            <li>To maintain, improve, and secure the FlashMenu platform.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/[0.08]">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">3</span>
            <span>Public Menu Information</span>
          </h2>
          <p>
            FlashMenu allows restaurants to publish digital menus that can be accessed publicly through QR codes or shared links.
          </p>
          <p>
            Information that you choose to publish on your public menu, including restaurant name, menu items, prices, descriptions, and images, may be visible to anyone who accesses your restaurant's FlashMenu link or scans its QR code.
          </p>
          <p className="text-amber-400/90 font-medium">
            Please ensure that all information you publish is accurate and appropriate for public display.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/[0.08]">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">4</span>
            <span>Data Security & Storage</span>
          </h2>
          <p>
            We take reasonable technical and organizational measures to protect your information. Account passwords are securely processed, and we use trusted infrastructure and cloud services to store and manage application data and uploaded images.
          </p>
          <p>
            Uploaded restaurant and menu images may be stored through secure third-party cloud storage services used by FlashMenu.
          </p>
          <p className="text-gray-400 italic">
            However, no method of transmission or electronic storage is completely secure. While we work to protect your information, we cannot guarantee absolute security.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/[0.08]">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">5</span>
            <span>Sharing With Third Parties</span>
          </h2>
          <p>
            FlashMenu does not sell or rent your personal information to third-party advertisers. We may use trusted third-party service providers where necessary to operate our platform, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li><strong>Cloud Storage Services:</strong> For securely storing and delivering uploaded restaurant and menu images.</li>
            <li><strong>Database & Hosting Services:</strong> For storing application data and operating the FlashMenu platform.</li>
            <li><strong>Payment Service Providers:</strong> If payment features are offered, payments may be processed through trusted third-party payment providers. FlashMenu does not store your complete card or bank payment credentials on its servers.</li>
            <li><strong>Legal Requirements:</strong> Information may be disclosed when required by applicable law, legal process, or government authorities.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/[0.08]">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">6</span>
            <span>Your Rights & Choices</span>
          </h2>
          <p>You have control over your account and information:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li><strong>Access:</strong> You can access and review information associated with your FlashMenu account.</li>
            <li><strong>Correction:</strong> You can update restaurant details, menu items, prices, descriptions, and other information through your account.</li>
            <li><strong>Deletion:</strong> You may request account deletion or removal of your personal information by contacting us.</li>
            <li><strong>Public Content:</strong> You can update or remove menu content that you have published through your FlashMenu account, subject to technical limitations and backup requirements.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/[0.08]">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">7</span>
            <span>Changes to This Privacy Policy</span>
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes to our services, technology, or legal requirements. Any updates will be posted on this page with a revised "Last Updated" date.
          </p>
          <p>We encourage you to review this Privacy Policy periodically.</p>
        </section>

        {/* Contact Us Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-white">Have privacy questions?</h3>
            <p className="text-xs text-gray-300 max-w-md">
              If you have questions about this Privacy Policy, want to request account deletion, or need information about how FlashMenu handles your data, please contact us.
            </p>
          </div>

          <a
            href="mailto:flashmenu18@gmail.com"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20 shrink-0"
          >
            <Mail className="w-4 h-4" />
            <span>flashmenu18@gmail.com</span>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
