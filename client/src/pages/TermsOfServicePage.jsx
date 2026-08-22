import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
import FlashLogoBadge from '../components/FlashLogoBadge';
import Footer from '../components/Footer';

export default function TermsOfServicePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Terms of Service | FlashMenu';
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

      {/* Main Terms Document Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-8">
        {/* Document Header */}
        <div className="space-y-4 border-b border-white/[0.08] pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Legal & Terms</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Terms of Service</h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium">Last Updated: August 2026</p>
        </div>

        {/* Intro */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 leading-relaxed text-sm text-gray-300">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Introduction & Acceptance</span>
          </h2>
          <p>
            Welcome to <strong>FlashMenu</strong> ("we," "our," or "us"). These Terms of Service govern your use of the FlashMenu platform, including our website, digital restaurant menus, QR menu features, and related services.
          </p>
          <p className="text-amber-400/90 font-medium">
            By creating an account or using FlashMenu, you agree to these Terms.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">1</span>
            <span>Our Services</span>
          </h2>
          <p>
            FlashMenu allows restaurants and businesses to create, manage, and publish digital menus. Our services may include restaurant profiles, menu management, image uploads, QR codes, and public menu links.
          </p>
          <p>We may update or improve our services from time to time.</p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/[0.08]">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">2</span>
            <span>Your Account</span>
          </h2>
          <p>You are responsible for providing accurate information and keeping your account credentials secure.</p>
          <p>You are also responsible for activities performed through your FlashMenu account.</p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/[0.08]">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">3</span>
            <span>Your Content</span>
          </h2>
          <p>
            You are responsible for the restaurant information, menu items, prices, descriptions, images, and other content you upload or publish through FlashMenu.
          </p>
          <p>
            You must ensure that your content is accurate, lawful, and that you have the necessary rights to use it.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/[0.08]">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">4</span>
            <span>Public Menus</span>
          </h2>
          <p>Menus published through FlashMenu may be publicly accessible through QR codes or shared links.</p>
          <p>
            Restaurant names, menu items, prices, descriptions, and images that you publish may be visible to anyone accessing your public menu.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/[0.08]">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">5</span>
            <span>Acceptable Use</span>
          </h2>
          <p>You must not use FlashMenu for unlawful, fraudulent, harmful, or abusive activities.</p>
          <p className="font-semibold text-white">You must not:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Upload illegal or misleading content.</li>
            <li>Attempt unauthorized access to accounts or systems.</li>
            <li>Interfere with the security or operation of FlashMenu.</li>
            <li>Upload harmful or malicious content.</li>
            <li>Violate the rights of others.</li>
          </ul>
          <p className="text-gray-400 italic pt-1">
            We may suspend or restrict accounts that violate these Terms.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/[0.08]">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">6</span>
            <span>Third-Party Services & Payments</span>
          </h2>
          <p>
            FlashMenu may use trusted third-party services for hosting, databases, image storage, and payment processing.
          </p>
          <p>
            If payment features are offered, payments may be processed through third-party payment providers. FlashMenu does not store complete card or bank payment credentials on its servers.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/[0.08]">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">7</span>
            <span>Service Availability</span>
          </h2>
          <p>
            We work to keep FlashMenu available and reliable, but we cannot guarantee uninterrupted or error-free service.
          </p>
          <p>
            Services may occasionally be affected by maintenance, technical issues, or third-party service interruptions.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/[0.08]">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">8</span>
            <span>Termination</span>
          </h2>
          <p>You may stop using FlashMenu at any time.</p>
          <p>
            We may suspend or terminate accounts that violate these Terms or create security, legal, or operational concerns.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/[0.08]">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">9</span>
            <span>Changes to These Terms</span>
          </h2>
          <p>
            We may update these Terms of Service from time to time. Updates will be posted on this page with a revised Last Updated date.
          </p>
          <p>
            Your continued use of FlashMenu after changes become effective means you accept the updated Terms.
          </p>
        </section>

        {/* Contact Us Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-white">Have questions?</h3>
            <p className="text-xs text-gray-300 max-w-md">
              If you have questions about these Terms of Service, please contact us.
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
