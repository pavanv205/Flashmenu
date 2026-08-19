import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050507] border-t border-white/[0.08] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center">
                <Zap className="w-4 h-4 text-black fill-black" />
              </div>
              <span className="font-extrabold text-xl text-white">
                Flash<span className="gold-gradient-text">Menu</span>
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              The ultimate QR-based digital restaurant menu platform. Instant mobile menus without app downloads.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><Link to="/menu/spice-garden" className="hover:text-white transition-colors">Live Demo</Link></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Restaurants</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/signup" className="hover:text-white transition-colors">Register Restaurant</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Owner Login</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">support@flashmenu.com</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
          <p>© {new Date().getFullYear()} FlashMenu. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex items-center space-x-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
