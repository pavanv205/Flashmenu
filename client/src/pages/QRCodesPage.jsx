import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PrintableQRCard from '../components/PrintableQRCard';
import { QrCode, Download, Printer, Table, ExternalLink, Crown, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toPng } from 'html-to-image';

export default function QRCodesPage() {
  const { restaurant } = useAuth();
  const [selectedTable, setSelectedTable] = useState('');
  const [downloading, setDownloading] = useState(false);

  if (!restaurant) return null;

  const isBasicPlan = !restaurant?.subscriptionPlan || restaurant?.subscriptionPlan === 'basic' || restaurant?.subscriptionPlan !== 'premium';

  const baseUrl = window.location.origin;
  const activeTable = selectedTable;

  const targetUrl = activeTable
    ? `${baseUrl}/menu/${restaurant.slug}?table=${activeTable}`
    : `${baseUrl}/menu/${restaurant.slug}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPNG = async () => {
    const cardNode = document.getElementById('printable-qr-card');
    if (!cardNode) return;
    setDownloading(true);

    try {
      const dataUrl = await toPng(cardNode, {
        cacheBust: true,
        pixelRatio: 2,
        width: 380,
        height: cardNode.offsetHeight,
        style: {
          transform: 'none',
          margin: '0 auto',
        },
      });
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `${restaurant.slug}-qr-card-${activeTable || 'master'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error('Failed to download QR card PNG:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Printable Table QR Codes
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Download high-resolution vector QR cards customized for your dining tables.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadPNG}
            disabled={downloading}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white text-black font-extrabold text-xs transition-all hover:bg-gray-200 shadow-md disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Generating PNG...' : 'Download PNG'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#0E0E14] border border-white/[0.08] hover:border-amber-500/50 text-white font-extrabold text-xs transition-all"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print QR Card</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column Controls */}
        <div className="space-y-6 lg:col-span-1">
          {/* Table Selection Box */}
          <div className="minimal-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Select Dining Table</h3>
              <span className="text-[9px] font-extrabold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                25 TABLES ACTIVE
              </span>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                Select Table Number (1 - {restaurant?.tableCount || 25})
              </label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-white/[0.08] text-white text-xs font-bold focus:outline-none focus:border-amber-500"
              >
                <option value="">Master QR Code (All Tables)</option>
                {Array.from({ length: restaurant?.tableCount || 25 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    Table #{num}
                  </option>
                ))}
              </select>
            </div>

            {/* Target URL Display Box */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Target Scan Link</h4>
              <div className="p-3 rounded-2xl bg-[#08080A] border border-white/[0.08] text-[11px] font-mono text-gray-300 flex items-center justify-between overflow-hidden">
                <span className="truncate">{targetUrl}</span>
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 p-1 shrink-0 ml-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Printable Card Preview */}
        <div className="lg:col-span-2 flex justify-center">
          <PrintableQRCard
            restaurantName={restaurant.name}
            logoUrl={restaurant.logo}
            qrCodeUrl={targetUrl}
            tableNumber={activeTable}
            tagline={restaurant.tagline}
          />
        </div>
      </div>
    </div>
  );
}
