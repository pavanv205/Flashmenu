import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import { ShoppingBag, Clock, CheckCircle, Crown, ArrowRight, Sparkles, CheckCircle2, Calendar, DollarSign, Filter, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function OrdersPage() {
  const { restaurant } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const isBasicPlan = !restaurant?.subscriptionPlan || restaurant?.subscriptionPlan === 'basic' || restaurant?.subscriptionPlan !== 'premium';

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getOrders();
      setOrders(res.data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, status);
      fetchOrders();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'PENDING') return order.status === 'NEW' || order.status === 'ACCEPTED' || order.status === 'PREPARING';
    if (activeFilter === 'COMPLETED') return order.status === 'SERVED' || order.status === 'COMPLETED';
    return true;
  });

  const total7DayRevenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'NEW' || o.status === 'ACCEPTED' || o.status === 'PREPARING').length;
  const completedCount = orders.filter((o) => o.status === 'SERVED' || o.status === 'COMPLETED').length;

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isBasicPlan) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 font-sans">
        <div className="rounded-3xl p-8 sm:p-12 text-center bg-[#0E0E14] border-2 border-amber-500/40 relative overflow-hidden shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
            <Crown className="w-8 h-8 text-amber-400 fill-amber-400/20" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-500/30 inline-block mb-1">
              PREMIUM PRO FEATURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Upgrade to Premium Plan to Access
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Live Table Ordering and 7-Day Order History are exclusive to the Premium Restaurant Plan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left py-2">
            <div className="p-3.5 rounded-2xl bg-[#08080A] border border-white/[0.08] flex items-center space-x-3 text-xs text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Real-Time Table Ordering & KDS</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#08080A] border border-white/[0.08] flex items-center space-x-3 text-xs text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>7-Day Order History & Analytics</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#08080A] border border-white/[0.08] flex items-center space-x-3 text-xs text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Instant Call Waiter & Bill Alerts</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#08080A] border border-white/[0.08] flex items-center space-x-3 text-xs text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Table-Specific QR Codes (1 to 25)</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/dashboard/subscription"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-black text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4 text-black fill-black" />
              <span>Upgrade to Premium Plan (₹1)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Live Orders & 7-Day History</h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time table orders and complete history over the last 7 days (Orders auto-delete after 7 days).
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#0E0E14] border border-white/[0.08] hover:border-amber-500/50 text-xs font-bold text-gray-300 hover:text-white transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* 7-Day Stats Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0E0E14] border border-white/[0.08] space-y-1">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">7-DAY REVENUE</span>
          <p className="text-xl sm:text-2xl font-black text-amber-400">
            {restaurant?.currency || '₹'}{total7DayRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-gray-500 block">Total earnings this week</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E0E14] border border-white/[0.08] space-y-1">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">TOTAL ORDERS</span>
          <p className="text-xl sm:text-2xl font-black text-white">{orders.length}</p>
          <span className="text-[10px] text-gray-500 block">Placed in last 7 days</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E0E14] border border-white/[0.08] space-y-1">
          <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">ACTIVE / PENDING</span>
          <p className="text-xl sm:text-2xl font-black text-amber-400">{pendingCount}</p>
          <span className="text-[10px] text-amber-400/70 block">Kitchen in progress</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E0E14] border border-white/[0.08] space-y-1">
          <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">COMPLETED</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-400">{completedCount}</p>
          <span className="text-[10px] text-emerald-400/70 block">Served to table</span>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-white/[0.08] pb-3 pt-2">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeFilter === 'ALL'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-[#0E0E14] text-gray-400 hover:text-white border border-white/[0.08]'
          }`}
        >
          All 7-Day Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveFilter('PENDING')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeFilter === 'PENDING'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-[#0E0E14] text-gray-400 hover:text-white border border-white/[0.08]'
          }`}
        >
          Active Orders ({pendingCount})
        </button>
        <button
          onClick={() => setActiveFilter('COMPLETED')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeFilter === 'COMPLETED'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'bg-[#0E0E14] text-gray-400 hover:text-white border border-white/[0.08]'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-[#0E0E14] rounded-3xl border border-white/[0.08]">
          <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Orders Found</h3>
          <p className="text-xs text-gray-400">Orders placed by customers over the last 7 days will show up here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="p-5 rounded-3xl bg-[#0E0E14] border border-white/[0.08] flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all">
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
                  <div>
                    <h3 className="font-extrabold text-white text-base">Table #{order.tableNumber}</h3>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[11px] text-gray-400 font-mono">#{String(order._id).slice(-6).toUpperCase()}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-[11px] text-amber-400 font-semibold flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-amber-400 inline" />
                        <span>
                          {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, {new Date(order.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                    order.status === 'NEW' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    order.status === 'ACCEPTED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                    order.status === 'PREPARING' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' :
                    order.status === 'SERVED' || order.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {order.status}
                  </span>
                </div>

                {/* Items list */}
                <div className="py-3 space-y-1.5 text-xs">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-gray-200">
                      <span><strong className="text-amber-400">{item.quantity}x</strong> {item.name}</span>
                      <span className="font-mono text-gray-400">{restaurant?.currency || '₹'}{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/[0.08] flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-400">Total Amount:</span>
                  <span className="text-base font-extrabold text-white">{restaurant?.currency || '₹'}{order.totalAmount}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                {order.status === 'NEW' && (
                  <button
                    onClick={() => handleStatusChange(order._id, 'ACCEPTED')}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-md"
                  >
                    Accept Order
                  </button>
                )}
                {order.status === 'ACCEPTED' && (
                  <button
                    onClick={() => handleStatusChange(order._id, 'PREPARING')}
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-all shadow-md"
                  >
                    Mark Preparing
                  </button>
                )}
                {order.status === 'PREPARING' && (
                  <button
                    onClick={() => handleStatusChange(order._id, 'SERVED')}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-md"
                  >
                    Mark Served
                  </button>
                )}
                {(order.status === 'SERVED' || order.status === 'COMPLETED') && (
                  <div className="flex-1 py-2 text-center text-xs font-bold text-emerald-400/80 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    ✓ Order Completed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
