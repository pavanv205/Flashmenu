import React from 'react';
import { Sparkles, Bot, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#040507] border-t border-indigo-500/20 py-16 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="space-y-3 max-w-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Flash<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-amber-400">Menu</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Powered by Stitch AI Architecture & Gemini Flash 2.0 Engine for instant digital dining.
            </p>
            <div className="flex items-center space-x-2 text-[10px] text-indigo-400 font-mono pt-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>STITCH AI DESIGN LABS</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-12 text-xs">
            <div className="space-y-3">
              <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">AI Studio</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#ai-generator" className="hover:text-indigo-400 transition-colors">Prompt Generator</a></li>
                <li><a href="#capabilities" className="hover:text-indigo-400 transition-colors">Gemini Capabilities</a></li>
                <li><a href="#how-it-works" className="hover:text-indigo-400 transition-colors">AI Pipeline</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-indigo-500/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} FlashMenu AI. All rights reserved.</p>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0 text-[11px]">
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span>Stitch AI Design System</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
