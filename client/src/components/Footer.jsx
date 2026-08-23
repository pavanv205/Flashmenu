import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#050507] border-t border-white/[0.08] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
        <div className="space-y-1 text-center sm:text-left">
          <p className="font-bold text-white">FlashMenu</p>
          <p className="text-[11px] text-gray-400">Turn your restaurant menu into a fast, beautiful digital experience.</p>
          <p className="text-[10px] text-gray-500 pt-1">© {new Date().getFullYear()} FlashMenu. All rights reserved.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-6">
          <Link to="/privacy" className="hover:text-amber-400 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-amber-400 transition-colors">
            Terms of Service
          </Link>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=flashmenu18@gmail.com&su=Inquiry%20regarding%20FlashMenu%20Platform&body=Hello%20FlashMenu%20Team,%0A%0AI%20would%20like%20to%20get%20in%20touch%20regarding..."
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors font-medium"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}
