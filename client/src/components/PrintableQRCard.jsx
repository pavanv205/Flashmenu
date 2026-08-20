import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Zap, Smartphone } from 'lucide-react';

export default function PrintableQRCard({
  restaurant,
  restaurantName,
  logoUrl,
  qrCodeUrl,
  tableNumber,
  targetUrl,
  tagline,
}) {
  const name = restaurant?.name || restaurantName || 'My Restaurant';
  const logo = restaurant?.logo || logoUrl || '';
  const qrUrl = targetUrl || qrCodeUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const primaryColor = restaurant?.primaryColor || '#F59E0B';
  const subTitle = tagline || restaurant?.tagline || 'DIGITAL MENU';

  return (
    <div
      id="printable-qr-card"
      style={{ width: '380px', boxSizing: 'border-box' }}
      className="max-w-full mx-auto rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden bg-[#0F172A] border-2 border-amber-500"
    >
      {/* Decorative Top Accent */}
      <div
        className="absolute top-0 left-0 right-0 h-3"
        style={{ backgroundColor: primaryColor }}
      />

      {/* Restaurant Header */}
      <div className="flex flex-col items-center text-center mb-4 pt-2">
        {logo ? (
          <img
            src={logo}
            alt={name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md mb-3"
          />
        ) : (
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-3"
            style={{ backgroundColor: primaryColor }}
          >
            <Zap className="w-8 h-8 text-black fill-black" />
          </div>
        )}

        <h2 className="text-xl font-extrabold text-white leading-tight tracking-tight px-2">
          {name}
        </h2>
        <span className="text-xs text-amber-400 font-extrabold tracking-wider uppercase mt-1 block">
          {subTitle}
        </span>
      </div>

      {/* Table Number Badge */}
      {tableNumber ? (
        <div className="inline-block px-5 py-2 rounded-2xl bg-amber-500 text-black shadow-lg shadow-amber-500/30 mb-5 border-2 border-amber-400">
          <span className="text-sm font-black uppercase tracking-widest block">
            TABLE #{tableNumber}
          </span>
        </div>
      ) : (
        <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 mb-5">
          <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest block">
            MASTER QR (ALL TABLES)
          </span>
        </div>
      )}

      {/* QR Code Container */}
      <div className="bg-white p-6 rounded-2xl inline-block shadow-2xl border-4 border-amber-500/30 mb-5 relative">
        <QRCodeSVG
          value={qrUrl}
          size={180}
          level="H"
          includeMargin={false}
        />
      </div>

      {/* Action Prompt */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-center space-x-2 text-white font-extrabold text-base">
          <Smartphone className="w-5 h-5 text-amber-400" />
          <span>Scan to View Menu</span>
        </div>
        <p className="text-xs text-gray-400 max-w-[250px] mx-auto">
          Point camera at QR code. No app or registration required.
        </p>
      </div>

      {/* Footer Branding */}
      <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-center space-x-2 text-[11px] text-gray-500">
        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
        <span className="font-semibold text-gray-400">Powered by FlashMenu</span>
      </div>
    </div>
  );
}
