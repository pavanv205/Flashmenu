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
      style={{
        width: '380px',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#0F172A',
        borderColor: '#F59E0B',
      }}
      className="max-w-full mx-auto rounded-3xl p-7 text-center shadow-2xl relative overflow-hidden border-2"
    >
      {/* Top Accent Stripe */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '12px',
          backgroundColor: primaryColor,
        }}
      />

      {/* Restaurant Branding Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '12px', marginBottom: '16px' }}>
        {logo ? (
          <img
            src={logo}
            alt={name}
            style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)', marginBottom: '10px' }}
          />
        ) : (
          <div
            style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', backgroundColor: primaryColor }}
          >
            <Zap style={{ width: '32px', height: '32px', color: '#000', fill: '#000' }} />
          </div>
        )}

        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.3', margin: '0', padding: '0 8px', letterSpacing: '-0.02em' }}>
          {name}
        </h2>
        <div style={{ marginTop: '4px', marginBottom: '2px' }}>
          <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: '800', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', display: 'inline-block' }}>
            {subTitle}
          </span>
        </div>
      </div>

      {/* Table Badge */}
      <div style={{ marginBottom: '18px' }}>
        {tableNumber ? (
          <div style={{ display: 'inline-block', padding: '8px 20px', borderRadius: '16px', backgroundColor: '#F59E0B', color: '#000', border: '2px solid #FBBF24', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block' }}>
              TABLE #{tableNumber}
            </span>
          </div>
        ) : (
          <div style={{ display: 'inline-block', padding: '6px 18px', borderRadius: '9999px', backgroundColor: 'rgba(245,158,11,0.18)', border: '1px solid rgba(245,158,11,0.4)', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block' }}>
              MASTER QR (ALL TABLES)
            </span>
          </div>
        )}
      </div>

      {/* QR Code Container */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '22px', borderRadius: '20px', display: 'inline-block', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', border: '4px solid rgba(245,158,11,0.3)', marginBottom: '18px' }}>
        <QRCodeSVG
          value={qrUrl}
          size={180}
          level="H"
          includeMargin={false}
        />
      </div>

      {/* Instruction Callout */}
      <div style={{ marginTop: '4px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyCenter: 'center', justifyContent: 'center', gap: '8px', color: '#FFFFFF', fontWeight: '800', fontSize: '15px', lineHeight: '1.4' }}>
          <Smartphone style={{ width: '18px', height: '18px', color: '#F59E0B' }} />
          <span>Scan to View Menu</span>
        </div>
        <p style={{ fontSize: '11px', color: '#94A3B8', margin: '4px auto 0 auto', maxWidth: '260px', lineHeight: '1.4' }}>
          Point phone camera at QR code. No app required.
        </p>
      </div>

      {/* Footer Branding */}
      <div style={{ paddingTop: '12px', borderTop: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: '#64748B' }}>
        <Zap style={{ width: '14px', height: '14px', color: '#F59E0B', fill: '#F59E0B' }} />
        <span style={{ fontWeight: '600', color: '#94A3B8' }}>Powered by FlashMenu</span>
      </div>
    </div>
  );
}
