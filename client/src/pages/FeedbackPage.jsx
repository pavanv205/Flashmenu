import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { MessageSquare, Star, Bell, Check, Crown, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function FeedbackPage() {
  const { restaurant } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [waiterCalls, setWaiterCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  const isBasicPlan = !restaurant?.subscriptionPlan || restaurant?.subscriptionPlan === 'basic' || restaurant?.subscriptionPlan !== 'premium';

  const loadData = async () => {
    try {
      const res = await analyticsAPI.getOverview();
      setWaiterCalls(res.data.waiterCalls || []);
      const fbRes = await analyticsAPI.getFeedback();
      setFeedbacks(fbRes.data || []);
    } catch (error) {
      console.error('Failed to load feedback page:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isBasicPlan) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isBasicPlan]);

  const handleResolve = async (id) => {
    try {
      await analyticsAPI.resolveWaiterCall(id);
      loadData();
    } catch (error) {
      alert('Error resolving request');
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
              Feedback & Live Waiter Calls
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
              Upgrade your restaurant to <strong className="text-amber-400">Premium Restaurant</strong> to receive instant table waiter calls and private customer ratings!
            </p>
          </div>

          {/* Feature Checklist */}
          <div className="bg-dark-base/80 rounded-2xl p-5 border border-dark-border max-w-md mx-auto text-left space-y-3">
            <div className="flex items-center space-x-3 text-xs text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Real-Time Waiter Assistance & Bill Request Alerts</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Private Customer Ratings & Food Reviews Feed</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Live Kitchen Order Management</span>
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
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Customer Reviews & Table Service Calls</h1>
        <p className="text-xs text-gray-400">Live feed of table assistance alerts and private ratings</p>
      </div>

      {/* Live Table Waiter Assistance Section */}
      <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Bell className="w-5 h-5 text-amber-400" />
          <span>Active Waiter Calls ({waiterCalls.length})</span>
        </h3>

        {waiterCalls.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No active assistance calls at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {waiterCalls.map((call) => (
              <div key={call._id} className="p-4 rounded-2xl bg-dark-base border border-dark-border flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-white text-sm">Table #{call.tableNumber}</h4>
                  <span className="text-xs text-amber-400 capitalize font-semibold">{call.type} requested</span>
                </div>
                <button
                  onClick={() => handleResolve(call._id)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center space-x-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Done</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-amber-400" />
          <span>Customer Reviews ({feedbacks.length})</span>
        </h3>

        {feedbacks.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No reviews submitted yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map((fb) => (
              <div key={fb._id} className="p-5 rounded-2xl bg-dark-base border border-dark-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(fb.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 font-semibold">{fb.tableNumber ? `Table #${fb.tableNumber}` : 'Dine-in'}</span>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed italic">"{fb.comment || 'No text comment'}"</p>
                <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-dark-border">
                  <span>— {fb.customerName || 'Anonymous'}</span>
                  <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
