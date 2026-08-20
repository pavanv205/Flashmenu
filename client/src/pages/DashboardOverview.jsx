import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Eye,
  Calendar,
  Users,
  UtensilsCrossed,
  FolderTree,
  CheckCircle,
  XCircle,
  Bell,
  Star,
  Check,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

import { Link, useNavigate } from 'react-router-dom';

export default function DashboardOverview() {
  const { user, restaurant } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isBasicPlan = !restaurant?.subscriptionPlan || restaurant?.subscriptionPlan === 'basic' || restaurant?.subscriptionPlan !== 'premium';

  const isLifetime = restaurant?.subscriptionCycle === 'lifetime';
  const expiresAtDate = restaurant?.subscriptionExpiresAt ? new Date(restaurant.subscriptionExpiresAt) : null;
  const isExpired = !isLifetime && expiresAtDate && expiresAtDate.getTime() <= Date.now();

  const fetchOverview = async () => {
    try {
      const res = await analyticsAPI.getOverview();
      setData(res.data);
    } catch (error) {
      console.error('Failed to load overview analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/dashboard/admin');
      return;
    }
    fetchOverview();
    const interval = setInterval(fetchOverview, 10000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const handleResolveCall = async (id) => {
    try {
      await analyticsAPI.resolveWaiterCall(id);
      fetchOverview();
    } catch (error) {
      console.error('Failed to resolve waiter call:', error);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { stats, viewsGraph, topItems, recentFeedback, waiterCalls } = data || {
    stats: {},
    viewsGraph: [],
    topItems: [],
    recentFeedback: [],
    waiterCalls: [],
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Expiration Notice Banner */}
      {isExpired && (
        <div className="p-5 rounded-3xl bg-red-950/40 border-2 border-red-500/80 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-red-950/30 animate-fade-in">
          <div className="flex items-center space-x-3.5 text-red-400">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-white">Your subscription plan has EXPIRED!</p>
              <p className="text-xs text-red-300 mt-0.5">Please activate or renew a plan to restore full restaurant QR services.</p>
            </div>
          </div>
          <Link
            to="/dashboard/subscription"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-extrabold text-xs transition-all shrink-0 shadow-lg shadow-red-500/20"
          >
            Activate Plan Now →
          </Link>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-8 rounded-3xl bg-[#0E0E14] border border-white/[0.07]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="gold-gradient-text">{restaurant?.name || 'Chef'}</span> 👋
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Here is your digital menu performance and live table activity summary.
          </p>
        </div>
        <a
          href={`/menu/${restaurant?.slug}?preview=true`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-full bg-white text-black font-extrabold text-xs transition-all hover:bg-gray-200 shadow-md"
        >
          View Live Menu
        </a>
      </div>

      {/* Live Waiter Calls Alert */}
      {waiterCalls && waiterCalls.length > 0 && (
        <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            <Bell className="w-4 h-4" />
            <span>Active Table Requests ({waiterCalls.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {waiterCalls.map((call) => (
              <div
                key={call._id}
                className="p-3.5 rounded-2xl bg-[#08080A] border border-white/[0.07] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-extrabold text-white">Table #{call.tableNumber}</span>
                  <span className="block text-gray-400 capitalize text-[11px]">{call.type} requested</span>
                </div>
                <button
                  onClick={() => handleResolveCall(call._id)}
                  className="px-3.5 py-1.5 rounded-full bg-emerald-500 text-black font-extrabold text-[11px] flex items-center space-x-1 hover:bg-emerald-400"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Done</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7 Key Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="minimal-card p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <Eye className="w-4 h-4 text-amber-400" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Total Views</span>
          </div>
          <p className="text-xl font-black text-white">{stats.totalViews}</p>
        </div>

        <div className="minimal-card p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Today's Scans</span>
          </div>
          <p className="text-xl font-black text-emerald-400">{stats.todayViews}</p>
        </div>

        <div className="minimal-card p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Unique Visitors</span>
          </div>
          <p className="text-xl font-black text-white">{stats.uniqueVisitors}</p>
        </div>

        <div className="minimal-card p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <UtensilsCrossed className="w-4 h-4 text-amber-400" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Menu Items</span>
          </div>
          <p className="text-xl font-black text-white">{stats.totalItems}</p>
        </div>

        <div className="minimal-card p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <FolderTree className="w-4 h-4 text-purple-400" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Categories</span>
          </div>
          <p className="text-xl font-black text-white">{stats.totalCategories}</p>
        </div>

        <div className="minimal-card p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Available</span>
          </div>
          <p className="text-xl font-black text-emerald-400">{stats.availableItems}</p>
        </div>

        <div className="minimal-card p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Sold Out</span>
          </div>
          <p className="text-xl font-black text-red-400">{stats.soldOutItems}</p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline Chart */}
        <div className="lg:col-span-2 minimal-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white">7-Day Menu Scans Timeline</h3>
              <p className="text-xs text-gray-400">Daily menu views over the past week</p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Live Scans
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsGraph}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0E0E14',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Dishes */}
        <div className="minimal-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-extrabold text-white">Top Viewed Menu Dishes</h3>
          <p className="text-xs text-gray-400">Most clicked items by diners</p>

          <div className="space-y-3 pt-2">
            {topItems && topItems.length > 0 ? (
              topItems.map((item, idx) => (
                <div
                  key={item._id}
                  className="p-3 rounded-2xl bg-[#08080A] border border-white/[0.06] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 font-extrabold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-extrabold text-white truncate max-w-[140px]">{item.name}</p>
                      <span className="text-[10px] text-amber-400 font-bold">₹{item.price}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-white">{item.viewsCount || 0}</span>
                    <span className="block text-[10px] text-gray-500 uppercase">clicks</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 py-4 text-center">No scan clicks logged yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
