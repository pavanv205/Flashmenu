import React from 'react';
import { CreditCard, CheckCircle } from 'lucide-react';

export default function SubscriptionPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Subscription & Plan Management</h1>
        <p className="text-xs text-gray-400">Manage your FlashMenu subscription tier and billing options</p>
      </div>

      <div className="p-6 rounded-3xl bg-dark-card border border-amber-500/40 flex items-center justify-between">
        <div>
          <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Current Plan</span>
          <h2 className="text-2xl font-extrabold text-white">PRO Restaurant Tier</h2>
          <p className="text-xs text-gray-400 mt-1">Includes unlimited categories, table-specific QR codes, live analytics & waiter calls.</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-xs">
          ACTIVE
        </div>
      </div>
    </div>
  );
}
