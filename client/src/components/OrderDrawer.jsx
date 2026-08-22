import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, CheckCircle2, Lock } from 'lucide-react';
import { publicAPI } from '../services/api';

export default function OrderDrawer({ isOpen, onClose, cart, updateQuantity, clearCart, restaurant, tableNumber }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  const activeTable = tableNumber || '1';
  const isPremiumPlan = restaurant?.subscriptionPlan === 'premium';

  if (!isOpen) return null;

  const totalAmount = cart.reduce((acc, item) => {
    const price = item.discountPrice || item.price;
    return acc + price * item.quantity;
  }, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const itemsPayload = cart.map((item) => ({
        menuItemId: item._id,
        quantity: item.quantity,
      }));

      const res = await publicAPI.createOrder({
        restaurantSlug: restaurant.slug,
        tableNumber: activeTable,
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
                <div className="flex items-center justify-between text-base font-extrabold text-white pt-1">
                  <span>Total Amount</span>
                  <span className="text-amber-400">{restaurant.currency || '₹'}{totalAmount}</span>
                </div>

                <div className="space-y-2">
                  {isPremiumPlan && (
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                    >
                      {loading ? 'Sending Order...' : 'Send Order to Kitchen'}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const phone = restaurant?.phone ? restaurant.phone.replace(/[^0-9]/g, '') : '916301592025';
                      const formattedPhone = phone.length === 10 ? `91${phone}` : phone;
                      const orderItemsText = cart
                        .map((i) => `• ${i.quantity}x ${i.name} (${restaurant.currency || '₹'}${i.price * i.quantity})`)
                        .join('\n');
                      const message = `*NEW ORDER - ${restaurant?.name || 'FlashMenu'}*\n*Table #${activeTable}*\n\n*Items Ordered:*\n${orderItemsText}\n\n*Total Amount:* ${restaurant?.currency || '₹'}${totalAmount}\n\nThank you!`;
                      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                    </svg>
                    <span>Send Order via WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
