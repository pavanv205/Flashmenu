import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { Eye, Users, Calendar, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await analyticsAPI.getOverview();
        setData(res.data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { stats, viewsGraph, topItems } = data || {};

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Menu Scan & Visitor Analytics</h1>
        <p className="text-xs text-gray-400">Deep insights into customer traffic, peak hours, and popular dishes</p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <Eye className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-semibold uppercase">Total Menu Scans</span>
          </div>
          <p className="text-3xl font-black text-white">{stats?.totalViews || 0}</p>
        </div>

        <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-semibold uppercase">Today's Visitors</span>
          </div>
          <p className="text-3xl font-black text-emerald-400">{stats?.todayViews || 0}</p>
        </div>

        <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <Users className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-semibold uppercase">Unique Diners</span>
          </div>
          <p className="text-3xl font-black text-cyan-400">{stats?.uniqueVisitors || 0}</p>
        </div>
      </div>

      {/* Daily Scans Histogram */}
      <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4">
        <h3 className="text-lg font-bold text-white">Daily Scan Volume</h3>
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={viewsGraph}>
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
              <Bar dataKey="views" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
