import React from 'react';
import { Zap, MousePointer, Layers } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#070709] border-t border-purple-500/20 py-16 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="space-y-3 max-w-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Flash<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-amber-400">Menu</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Figma-Inspired Collaborative Canvas Engine for digital restaurant menus.
            </p>
            <div className="flex items-center space-x-2 text-[10px] text-purple-400 font-mono pt-1">
              <Layers className="w-3.5 h-3.5" />
              <span>FIGMA DESIGN SYSTEM ARCHITECTURE</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-12 text-xs">
            <div className="space-y-3">
              <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Canvas Tools</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#canvas-features" className="hover:text-purple-400 transition-colors">Design System</a></li>
                <li><a href="#workflow" className="hover:text-purple-400 transition-colors">Workflow Pipeline</a></li>
                <li><a href="#pricing" className="hover:text-purple-400 transition-colors">Plans & Access</a></li>
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

        <div className="pt-8 border-t border-purple-500/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} FlashMenu Studio. All rights reserved.</p>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0 text-[11px]">
            <MousePointer className="w-3.5 h-3.5 text-amber-400" />
            <span>Figma Canvas UI Design</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
