import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import { Clock, Crown, ArrowRight, Sparkles, CheckCircle2, RefreshCw, Calendar, DollarSign, History, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function OrderHistoryPage() {
  const { restaurant } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedDay, setSelectedDay] = useState('ALL');

  const isBasicPlan = !restaurant?.subscriptionPlan || restaurant?.subscriptionPlan === 'basic' || restaurant?.subscriptionPlan !== 'premium';

  const fetchHistory = async () => {
    try {
      const res = await orderAPI.getOrderHistory();
      setOrders(res.data || []);
    } catch (error) {
      console.error('Error loading order history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const get7DayPills = () => {
    const pills = [{ id: 'ALL', label: 'All 7 Days' }];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      let label = '';
      if (i === 0) label = `Today (${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})`;
      else if (i === 1) label = `Yesterday (${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})`;
      else label = `${d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}`;

      // Count orders for this specific date
      const count = orders.filter((o) => {
        const oDateStr = new Date(o.createdAt).toISOString().split('T')[0];
        return oDateStr === dateStr;
      }).length;

      pills.push({ id: dateStr, label: `${label} (${count})` });
    }
    return pills;
  };

  const filteredOrders = orders.filter((order) => {
    // 1. Individual day filter
    if (selectedDay !== 'ALL') {
      const orderDateStr = new Date(order.createdAt).toISOString().split('T')[0];
      if (orderDateStr !== selectedDay) return false;
    }

    // 2. Status filter
    if (statusFilter === 'COMPLETED') return order.status === 'SERVED' || order.status === 'COMPLETED';
    if (statusFilter === 'ACTIVE') return order.status === 'NEW' || order.status === 'ACCEPTED' || order.status === 'PREPARING';
    return true;
  });

  const displayOrdersForStats = selectedDay === 'ALL' 
    ? orders 
    : orders.filter((o) => new Date(o.createdAt).toISOString().split('T')[0] === selectedDay);

  const totalRevenue = displayOrdersForStats.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
  const completedCount = displayOrdersForStats.filter((o) => o.status === 'SERVED' || o.status === 'COMPLETED').length;
  const avgOrderValue = displayOrdersForStats.length > 0 ? Math.round(totalRevenue / displayOrdersForStats.length) : 0;

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
              Order History, 7-Day Revenue Analytics, and Table Order Logs are exclusive to the Premium Restaurant Plan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left py-2">
            <div className="p-3.5 rounded-2xl bg-[#08080A] border border-white/[0.08] flex items-center space-x-3 text-xs text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>7-Day Order History & Log Archives</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#08080A] border border-white/[0.08] flex items-center space-x-3 text-xs text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Real-Time Table Ordering & KDS</span>
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
          <div className="flex items-center space-x-2">
            <History className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-extrabold text-white">Order History (24 Hours)</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Complete records of customer orders placed over the past 24 hours (Orders permanently auto-delete after 24 hours).
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#0E0E14] border border-white/[0.08] hover:border-amber-500/50 text-xs font-bold text-gray-300 hover:text-white transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Refresh History</span>
        </button>
      </div>

      {/* 24-Hour Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0E0E14] border border-white/[0.08] space-y-1">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">24-HOUR TOTAL REVENUE</span>
          <p className="text-xl sm:text-2xl font-black text-amber-400">
            {restaurant?.currency || '₹'}{totalRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-gray-500 block">Total sales in 24 hours</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E0E14] border border-white/[0.08] space-y-1">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">TOTAL ORDERS</span>
          <p className="text-xl sm:text-2xl font-black text-white">{displayOrdersForStats.length}</p>
          <span className="text-[10px] text-gray-500 block">Past 24 hours history</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E0E14] border border-white/[0.08] space-y-1">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">SERVED / COMPLETED</span>
          <p className="text-xl sm:text-2xl font-black text-white">{completedCount}</p>
          <span className="text-[10px] text-gray-400 block">Completed orders</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E0E14] border border-white/[0.08] space-y-1">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">AVG ORDER VALUE</span>
          <p className="text-xl sm:text-2xl font-black text-amber-400">
            {restaurant?.currency || '₹'}{avgOrderValue}
          </p>
          <span className="text-[10px] text-gray-400 block">Per order average</span>
        </div>
      </div>

      {/* Individual Day-by-Day Selector Pills */}
      <div className="space-y-2">
        <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
          Select Individual Day (Last 7 Days):
        </label>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {get7DayPills().map((pill) => (
            <button
              key={pill.id}
              onClick={() => setSelectedDay(pill.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedDay === pill.id
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-[#0E0E14] text-gray-300 hover:text-white border border-white/[0.08] hover:border-amber-500/40'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/[0.08] pb-3 pt-1">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            statusFilter === 'ALL'
              ? 'bg-amber-500 text-black font-extrabold shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          All Statuses ({displayOrdersForStats.length})
        </button>
        <button
          onClick={() => setStatusFilter('COMPLETED')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            statusFilter === 'COMPLETED'
              ? 'bg-amber-500 text-black font-extrabold shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Completed ({completedCount})
        </button>
        <button
          onClick={() => setStatusFilter('ACTIVE')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            statusFilter === 'ACTIVE'
              ? 'bg-amber-500 text-black font-extrabold shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Active / Kitchen ({displayOrdersForStats.length - completedCount})
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-[#0E0E14] rounded-3xl border border-white/[0.08]">
          <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Order History Found</h3>
          <p className="text-xs text-gray-400">Order records for the last 7 days will appear here.</p>
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
                    order.status === 'NEW' || order.status === 'ACCEPTED' || order.status === 'PREPARING'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-white/10 text-white border border-white/20'
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
