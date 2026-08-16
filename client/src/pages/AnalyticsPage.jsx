import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { UtensilsCrossed, FolderTree, CheckCircle, XCircle } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await analyticsAPI.getOverview();
        setData(res.data);
      } catch (error) {
        console.error('Failed to load menu summary:', error);
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

  const { stats, topItems } = data || {};

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Menu & Catalog Overview</h1>
        <p className="text-xs text-gray-400">Quick summary of active dishes, categories, and availability status</p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <UtensilsCrossed className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-semibold uppercase">Total Dishes</span>
          </div>
          <p className="text-3xl font-black text-white">{stats?.totalItems || 0}</p>
        </div>

        <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <FolderTree className="w-5 h-5 text-purple-400" />
            <span className="text-xs font-semibold uppercase">Categories</span>
          </div>
          <p className="text-3xl font-black text-white">{stats?.totalCategories || 0}</p>
        </div>

        <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-semibold uppercase">Available Now</span>
          </div>
          <p className="text-3xl font-black text-emerald-400">{stats?.availableItems || 0}</p>
        </div>

        <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-xs font-semibold uppercase">Sold Out</span>
          </div>
          <p className="text-3xl font-black text-red-400">{stats?.soldOutItems || 0}</p>
        </div>
      </div>

      {/* Bestseller Dishes List */}
      <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4">
        <h3 className="text-lg font-bold text-white">Bestseller Dishes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topItems && topItems.length > 0 ? (
            topItems.map((item) => (
              <div key={item._id} className="p-4 rounded-2xl bg-dark-base border border-dark-border flex items-center space-x-3">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-dark-hover flex items-center justify-center text-gray-500 font-bold text-xs">
                    Food
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                  <span className="text-xs text-amber-400 font-semibold">₹{item.price}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400">No items available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
