import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import { ShoppingBag, Clock, CheckCircle, Crown, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function OrdersPage() {
  const { restaurant } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const isBasicPlan = !restaurant?.subscriptionPlan || restaurant?.subscriptionPlan === 'basic' || restaurant?.subscriptionPlan !== 'premium';

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getOrders();
      setOrders(res.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isBasicPlan) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isBasicPlan]);

  const handleStatusChange = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, status);
      fetchOrders();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // PREMIUM UPGRADE SCREEN FOR BASIC RESTAURANTS
  if (isBasicPlan) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-gradient-to-b from-dark-card to-[#162238] border-2 border-amber-500 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden gold-glow">
          {/* Top Badge */}
          <div className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Premium Feature Upgrade</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Unlock Live Table Ordering
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
              Allow your customers to browse food and place live kitchen orders directly from their phone camera scan!
            </p>
          </div>

          {/* Feature Checklist */}
          <div className="bg-dark-base/80 rounded-2xl p-5 border border-dark-border max-w-md mx-auto text-left space-y-3">
            <div className="flex items-center space-x-3 text-xs text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Real-Time Digital Kitchen Order Management</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Table-Specific QR Codes (Table 1 to 50)</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Instant Call Waiter & Customer Review Tools</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>24/7 Priority Support & Full Analytics</span>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="pt-2">
            <div className="text-2xl font-black text-white">
              ₹999 <span className="text-xs text-gray-400 font-normal">/ month</span>
            </div>
            <p className="text-[11px] text-amber-400 font-semibold mt-0.5">Cancel or switch plans anytime</p>
          </div>

          <div className="pt-2">
            <Link
              to="/dashboard/subscription"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm transition-all shadow-xl shadow-amber-500/25 hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-black fill-black" />
              <span>Upgrade to Premium Restaurant</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Live Kitchen Orders</h1>
        <p className="text-xs text-gray-400">Incoming table orders placed directly from customer mobile menus</p>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-dark-card rounded-3xl border border-dark-border">
          <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Orders Received Yet</h3>
          <p className="text-xs text-gray-400">Orders placed by customers on their phone will show up here in real-time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div key={order._id} className="p-5 rounded-3xl bg-dark-card border border-dark-border flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-dark-border">
                  <div>
                    <h3 className="font-extrabold text-white text-base">Table #{order.tableNumber}</h3>
                    <span className="text-[11px] text-gray-400 font-mono">#{order._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    order.status === 'NEW' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    order.status === 'PREPARING' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' :
                    order.status === 'SERVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {order.status}
                  </span>
                </div>

                {/* Items list */}
                <div className="py-3 space-y-1.5 text-xs">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-gray-200">
                      <span><strong className="text-amber-400">{item.quantity}x</strong> {item.name}</span>
                      <span className="font-mono text-gray-400">{restaurant?.currency || '₹'}{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-dark-border flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-400">Total Amount:</span>
                  <span className="text-base font-extrabold text-white">{restaurant?.currency || '₹'}{order.totalAmount}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                {order.status === 'NEW' && (
                  <button
                    onClick={() => handleStatusChange(order._id, 'ACCEPTED')}
                    className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
                  >
                    Accept Order
                  </button>
                )}
                {order.status === 'ACCEPTED' && (
                  <button
                    onClick={() => handleStatusChange(order._id, 'PREPARING')}
                    className="flex-1 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs"
                  >
                    Mark Preparing
                  </button>
                )}
                {order.status === 'PREPARING' && (
                  <button
                    onClick={() => handleStatusChange(order._id, 'SERVED')}
                    className="flex-1 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs"
                  >
                    Mark Served
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
