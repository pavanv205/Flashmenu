import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#080C13] border-t border-gray-800/60 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-black fill-black" />
              </div>
              <span className="font-extrabold text-xl text-white">Flash<span className="gold-gradient-text">Menu</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The ultimate QR-based digital restaurant menu platform. Instant mobile menus without app downloads.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-brand-400 transition-colors">Features</Link></li>
              <li><Link to="/menu/spice-garden" className="hover:text-brand-400 transition-colors">Live Demo</Link></li>
              <li><a href="#pricing" className="hover:text-brand-400 transition-colors">Pricing</a></li>
              <li><a href="#faq" className="hover:text-brand-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Restaurants</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/signup" className="hover:text-brand-400 transition-colors">Register Restaurant</Link></li>
              <li><Link to="/login" className="hover:text-brand-400 transition-colors">Owner Login</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact & Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="hover:text-brand-400 transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-brand-400 transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-brand-400 transition-colors cursor-pointer">support@flashmenu.com</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} FlashMenu SaaS. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for hospitality leaders worldwide</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
