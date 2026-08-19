import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#050507] border-t border-white/[0.08] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
        <p>© {new Date().getFullYear()} FlashMenu. All rights reserved.</p>
        <div className="mt-4 sm:mt-0 flex items-center space-x-6">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
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
