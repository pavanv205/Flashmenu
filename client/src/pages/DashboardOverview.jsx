import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  UtensilsCrossed,
  FolderTree,
  CheckCircle,
  XCircle,
  Plus,
  QrCode,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardOverview() {
  const { restaurant } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    try {
      const res = await analyticsAPI.getOverview();
      setData(res.data);
    } catch (error) {
      console.error('Failed to load overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { stats, topItems } = data || {
    stats: {},
    topItems: [],
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-dark-card via-[#131B2E] to-dark-base border border-dark-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, <span className="gold-gradient-text">{restaurant?.name || 'Chef'}</span> 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage your digital menu items, categories, and instant SOLD OUT availability.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/dashboard/items"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </Link>
          <a
            href={`/menu/${restaurant?.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-dark-card border border-dark-border hover:border-amber-500/40 text-white font-bold text-xs transition-all flex items-center space-x-1.5"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>View Live Menu</span>
          </a>
        </div>
      </div>

      {/* 4 Core Menu Management Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <UtensilsCrossed className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Total Menu Items</span>
          </div>
          <p className="text-2xl font-black text-white">{stats.totalItems || 0}</p>
        </div>

        <div className="p-5 rounded-3xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <FolderTree className="w-5 h-5 text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Categories</span>
          </div>
          <p className="text-2xl font-black text-white">{stats.totalCategories || 0}</p>
        </div>

        <div className="p-5 rounded-3xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Available Items</span>
          </div>
          <p className="text-2xl font-black text-emerald-400">{stats.availableItems || 0}</p>
        </div>

        <div className="p-5 rounded-3xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Sold Out Items</span>
          </div>
          <p className="text-2xl font-black text-red-400">{stats.soldOutItems || 0}</p>
        </div>
      </div>

      {/* Quick Menu Actions & Popular Dishes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Menu Actions */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4">
          <h3 className="text-lg font-bold text-white">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/dashboard/items"
              className="p-4 rounded-2xl bg-dark-base border border-dark-border hover:border-amber-500/40 transition-all space-y-2 group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Menu Items</h4>
              <p className="text-xs text-gray-400">Add dishes, set prices, and toggle instant SOLD OUT status.</p>
            </Link>

            <Link
              to="/dashboard/categories"
              className="p-4 rounded-2xl bg-dark-base border border-dark-border hover:border-amber-500/40 transition-all space-y-2 group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-black transition-all">
                <FolderTree className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Categories</h4>
              <p className="text-xs text-gray-400">Organize starters, biryanis, main course, and drinks.</p>
            </Link>

            <Link
              to="/dashboard/qr-codes"
              className="p-4 rounded-2xl bg-dark-base border border-dark-border hover:border-amber-500/40 transition-all space-y-2 group"
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all">
                <QrCode className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">QR Code Generator</h4>
              <p className="text-xs text-gray-400">Download printable QR cards for your tables.</p>
            </Link>

            <Link
              to="/dashboard/profile"
              className="p-4 rounded-2xl bg-dark-base border border-dark-border hover:border-amber-500/40 transition-all space-y-2 group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Restaurant Settings</h4>
              <p className="text-xs text-gray-400">Update logo, cover image, and opening hours.</p>
            </Link>
          </div>
        </div>

        {/* Featured / Bestseller Dishes */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4">
          <h3 className="text-lg font-bold text-white">Bestseller Dishes</h3>
          <div className="space-y-3">
            {topItems && topItems.length > 0 ? (
              topItems.slice(0, 4).map((item) => (
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
                      Bestseller
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400">No dishes added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
