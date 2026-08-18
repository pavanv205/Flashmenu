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
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function DashboardOverview() {
  const { restaurant } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isBasicPlan = !restaurant?.subscriptionPlan || restaurant?.subscriptionPlan === 'basic' || restaurant?.subscriptionPlan !== 'premium';

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
    fetchOverview();
    const interval = setInterval(fetchOverview, 10000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-dark-card via-[#131B2E] to-dark-base border border-dark-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, <span className="gold-gradient-text">{restaurant?.name || 'Chef'}</span> 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Here is your digital menu performance and live table activity summary.
          </p>
        </div>
        <a
          href={`/menu/${restaurant?.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20"
        >
          View Live Menu
        </a>
      </div>

      {/* Live Waiter Calls Alert */}
      {waiterCalls && waiterCalls.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 animate-pulse-glow">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <Bell className="w-5 h-5" />
            <span>Active Table Requests ({waiterCalls.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {waiterCalls.map((call) => (
              <div
                key={call._id}
                className="p-3 rounded-xl bg-dark-card border border-dark-border flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-extrabold text-white">Table #{call.tableNumber}</span>
                  <span className="block text-gray-400 capitalize">{call.type} requested</span>
                </div>
                <button
                  onClick={() => handleResolveCall(call._id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold flex items-center space-x-1 hover:bg-emerald-400"
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
        <div className="p-4 rounded-2xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <Eye className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-semibold uppercase">Total Views</span>
          </div>
          <p className="text-xl font-black text-white">{stats.totalViews}</p>
        </div>

        <div className="p-4 rounded-2xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-semibold uppercase">Today's Scans</span>
          </div>
          <p className="text-xl font-black text-emerald-400">{stats.todayViews}</p>
        </div>

        <div className="p-4 rounded-2xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-semibold uppercase">Unique Visitors</span>
          </div>
          <p className="text-xl font-black text-white">{stats.uniqueVisitors}</p>
        </div>

        <div className="p-4 rounded-2xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <UtensilsCrossed className="w-4 h-4 text-brand-400" />
            <span className="text-[10px] font-semibold uppercase">Menu Items</span>
          </div>
          <p className="text-xl font-black text-white">{stats.totalItems}</p>
        </div>

        <div className="p-4 rounded-2xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <FolderTree className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-semibold uppercase">Categories</span>
          </div>
          <p className="text-xl font-black text-white">{stats.totalCategories}</p>
        </div>

        <div className="p-4 rounded-2xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-semibold uppercase">Available</span>
          </div>
          <p className="text-xl font-black text-emerald-400">{stats.availableItems}</p>
        </div>

        <div className="p-4 rounded-2xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-[10px] font-semibold uppercase">Sold Out</span>
          </div>
          <p className="text-xl font-black text-red-400">{stats.soldOutItems}</p>
        </div>
      </div>

      {/* Popular items & Graph section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 7-Day Views Graph */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">7-Day Menu Scans Timeline</h3>
              <p className="text-xs text-gray-400">Customer views tracked over the past week</p>
            </div>
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
                    backgroundColor: '#131B2E',
                    borderColor: '#1F293D',
                    borderRadius: '12px',
                    color: '#FFF',
                  }}
                />
                <Area type="monotone" dataKey="views" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Viewed Items */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4">
          <h3 className="text-lg font-bold text-white">Popular Menu Items</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {topItems.slice(0, 6).map((item) => (
              <div
                key={item._id}
                className="p-3 rounded-2xl bg-dark-base border border-dark-border flex items-center space-x-3"
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-dark-hover flex items-center justify-center text-gray-500 font-bold text-xs">
                    Food
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                  <span className="text-xs text-amber-400 font-semibold">{restaurant?.currency || '₹'}{item.price}</span>
                </div>
                {item.isBestseller && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-extrabold uppercase">
                    Top
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Feedback Feed */}
      <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">Recent Customer Reviews</h3>
          <p className="text-xs text-gray-400 mt-0.5">Reviews are displayed for 24 hours and automatically deleted.</p>
        </div>
        {recentFeedback && recentFeedback.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentFeedback.map((fb) => (
              <div key={fb._id} className="p-4 rounded-2xl bg-dark-base border border-dark-border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(fb.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{fb.tableNumber ? `Table ${fb.tableNumber}` : 'Dine-in'}</span>
                </div>
                <p className="text-xs text-gray-300 italic">"{fb.comment || 'No comment provided'}"</p>
                <span className="block text-[11px] text-gray-500 font-medium">— {fb.customerName || 'Anonymous'}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No customer feedback submitted yet.</p>
        )}
      </div>
    </div>
  );
}
