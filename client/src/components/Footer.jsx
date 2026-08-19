import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#050507] border-t border-white/[0.08] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
        <p>© {new Date().getFullYear()} FlashMenu. All rights reserved.</p>
        <div className="mt-4 sm:mt-0 flex items-center space-x-6">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
          <a href="mailto:support@flashmenu.com" className="hover:text-white transition-colors font-medium">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
