import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PrintableQRCard from '../components/PrintableQRCard';
import { QrCode, Download, Printer, Table, ExternalLink, Crown, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QRCodesPage() {
  const { restaurant } = useAuth();
  const [selectedTable, setSelectedTable] = useState('');

  if (!restaurant) return null;

  const isBasicPlan = !restaurant?.subscriptionPlan || restaurant?.subscriptionPlan === 'basic' || restaurant?.subscriptionPlan !== 'premium';

  const baseUrl = window.location.origin;
  const activeTable = isBasicPlan ? '' : selectedTable;

  const targetUrl = activeTable
    ? `${baseUrl}/menu/${restaurant.slug}?table=${activeTable}`
    : `${baseUrl}/menu/${restaurant.slug}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPNG = () => {
    const svgElement = document.querySelector('#printable-qr-card svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 80;
      canvas.height = img.height + 80;
      if (ctx) {
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 40, 40);
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `${restaurant.slug}-qr-table-${activeTable || 'master'}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">QR Code Generator & Print Cards</h1>
          <p className="text-xs text-gray-400">
            Generate master or table-specific QR codes for your restaurant standees & table stickers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadPNG}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-dark-card border border-dark-border text-white hover:border-amber-500 font-bold text-xs transition-all"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download PNG</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print QR Card</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls & Table Selector */}
        <div className="lg:col-span-5 space-y-6">
          {isBasicPlan ? (
            <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Table className="w-4 h-4 text-amber-400" />
                  <span>Master Restaurant QR Code</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                  Basic Plan
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Your Basic Restaurant account includes <strong className="text-white">1 Master Digital Menu QR Code</strong> for your restaurant standees, table tent cards, and entrance posters.
              </p>

              {/* Upgrade Promo Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-400/5 border border-amber-500/30 space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-extrabold text-amber-400">
                  <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Table-Specific QR Codes (Table 1 to 50)</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-snug">
                  Want individual table numbers printed on QR stickers for instant waiter calls & ordering?
                </p>
                <Link
                  to="/dashboard/subscription"
                  className="inline-flex items-center space-x-1.5 text-xs text-amber-400 font-bold hover:underline pt-1"
                >
                  <span>Upgrade to Premium Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Table className="w-4 h-4 text-amber-400" />
                <span>Select Table Number</span>
              </h3>
              <p className="text-xs text-gray-400">
                Leave blank for the master restaurant QR code or select a table number (1 to {restaurant.tableCount || 20}) for table-specific ordering.
              </p>

              <input
                type="number"
                min="1"
                max="100"
                placeholder="e.g. 5 (Leave blank for Master QR)"
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500 font-bold"
              />

              {/* Quick table buttons grid */}
              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Quick Select Table:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['', '1', '2', '3', '4', '5', '6', '7', '8', '10'].map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedTable(num)}
                      className={`py-2 rounded-xl text-xs font-extrabold border transition-all ${
                        selectedTable === num
                          ? 'bg-amber-500 text-black border-amber-500'
                          : 'bg-dark-base text-gray-300 border-dark-border hover:bg-dark-hover'
                      }`}
                    >
                      {num === '' ? 'Master' : `#${num}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-3">
            <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Target Scan Link</h4>
            <div className="p-3 bg-dark-base rounded-xl border border-dark-border break-all font-mono text-xs text-gray-300">
              {targetUrl}
            </div>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-amber-400 font-semibold hover:underline"
            >
              <span>Test destination link in browser</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Print-Ready Card Display */}
        <div className="lg:col-span-7 flex justify-center">
          <PrintableQRCard
            restaurant={restaurant}
            tableNumber={activeTable}
            targetUrl={targetUrl}
          />
        </div>
      </div>
    </div>
  );
}
