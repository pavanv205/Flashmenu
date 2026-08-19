import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react';
import { publicAPI } from '../services/api';

export default function OrderDrawer({ isOpen, onClose, cart, updateQuantity, clearCart, restaurant, tableNumber }) {
  const [inputTable, setInputTable] = useState(tableNumber || '');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((acc, item) => {
    const price = item.discountPrice || item.price;
    return acc + price * item.quantity;
  }, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    const finalTable = inputTable || tableNumber;
    if (!finalTable) {
      alert('Please specify your table number.');
      return;
    }

    setLoading(true);
    try {
      const itemsPayload = cart.map((item) => ({
        menuItemId: item._id,
        quantity: item.quantity,
      }));

      const res = await publicAPI.createOrder({
        restaurantSlug: restaurant.slug,
        tableNumber: finalTable,
        items: itemsPayload,
        customerName,
        customerPhone,
      });

      setSuccessOrder(res.data.order);
      clearCart();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end font-sans">
      <div className="w-full max-w-md bg-[#0E0E14] border-l border-white/[0.08] h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Your Tray</h3>
              <p className="text-xs text-gray-400">{cart.length} item(s) selected</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-dark-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {successOrder ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
            <h4 className="text-xl font-bold text-white">Order Sent to Kitchen!</h4>
            <p className="text-sm text-gray-400 max-w-xs">
              Order #{successOrder._id.slice(-6).toUpperCase()} for Table #{successOrder.tableNumber} has been received.
            </p>
            <div className="p-4 bg-dark-base rounded-2xl border border-dark-border text-left w-full space-y-2 text-xs">
              <div className="flex justify-between font-semibold text-gray-300">
                <span>Status:</span>
                <span className="text-amber-400 uppercase font-bold">{successOrder.status}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-300">
                <span>Total Amount:</span>
                <span className="text-white font-bold">{restaurant.currency || '₹'}{successOrder.totalAmount}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setSuccessOrder(null);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold text-sm"
            >
              Back to Menu
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3 text-gray-500">
                  <ShoppingBag className="w-12 h-12 mx-auto opacity-30" />
                  <p className="text-sm">Your tray is currently empty.</p>
                </div>
              ) : (
                cart.map((item) => {
                  const effectivePrice = item.discountPrice || item.price;
                  return (
                    <div
                      key={item._id}
                      className="p-4 rounded-2xl bg-dark-base border border-dark-border flex items-center justify-between"
                    >
                      <div className="flex-1 pr-3">
                        <h4 className="text-sm font-bold text-white">{item.name}</h4>
                        <p className="text-xs text-amber-400 font-semibold">
                          {restaurant.currency || '₹'}{effectivePrice}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 bg-dark-hover p-1 rounded-xl">
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          className="w-7 h-7 rounded-lg bg-dark-card flex items-center justify-center text-gray-300 hover:text-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, 1)}
                          className="w-7 h-7 rounded-lg bg-amber-500 text-black flex items-center justify-center font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Form & Checkout */}
            {cart.length > 0 && (
              <form onSubmit={handlePlaceOrder} className="p-4 sm:p-6 border-t border-dark-border space-y-4 bg-dark-card">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Table Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12"
                    value={inputTable || tableNumber || ''}
                    onChange={(e) => setInputTable(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500 font-semibold"
                  />
                </div>

                <div className="flex items-center justify-between text-base font-extrabold text-white pt-2 border-t border-dark-border">
                  <span>Total Amount</span>
                  <span className="text-amber-400">{restaurant.currency || '₹'}{totalAmount}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {loading ? 'Sending Order...' : 'Send Order to Kitchen'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
