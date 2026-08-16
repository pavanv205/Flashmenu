import React, { useState } from 'react';
import { Bell, Droplets, Receipt, HelpCircle, X, CheckCircle2 } from 'lucide-react';
import { publicAPI } from '../services/api';

export default function CallWaiterModal({ isOpen, onClose, restaurantSlug, defaultTable }) {
  const [tableNumber, setTableNumber] = useState(defaultTable || '');
  const [requestType, setRequestType] = useState('water'); // water, bill, assistance
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tableNumber) return;

    setLoading(true);
    try {
      await publicAPI.callWaiter({
        restaurantSlug,
        tableNumber,
        type: requestType,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      alert('Failed to call waiter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-dark-card border border-dark-border rounded-3xl p-6 w-full max-w-md relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-dark-hover"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Call Waiter</h3>
            <p className="text-xs text-gray-400">Instant service request to your table</p>
          </div>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-white">Waiter Notified!</h4>
            <p className="text-xs text-gray-400">Our staff is on their way to Table #{tableNumber}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Table Number Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Table Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 5 or 12"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-base border border-dark-border text-white focus:outline-none focus:border-amber-500 text-sm font-semibold"
              />
            </div>

            {/* Request Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Request Service
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRequestType('water')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
                    requestType === 'water'
                      ? 'bg-amber-500 text-black border-amber-500 font-bold'
                      : 'bg-dark-base text-gray-300 border-dark-border hover:bg-dark-hover'
                  }`}
                >
                  <Droplets className="w-5 h-5 mb-1" />
                  <span>Water</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRequestType('bill')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
                    requestType === 'bill'
                      ? 'bg-amber-500 text-black border-amber-500 font-bold'
                      : 'bg-dark-base text-gray-300 border-dark-border hover:bg-dark-hover'
                  }`}
                >
                  <Receipt className="w-5 h-5 mb-1" />
                  <span>Get Bill</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRequestType('assistance')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
                    requestType === 'assistance'
                      ? 'bg-amber-500 text-black border-amber-500 font-bold'
                      : 'bg-dark-base text-gray-300 border-dark-border hover:bg-dark-hover'
                  }`}
                >
                  <HelpCircle className="w-5 h-5 mb-1" />
                  <span>Assistance</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {loading ? 'Notifying...' : 'Send Request Now'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
