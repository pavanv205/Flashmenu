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
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

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
              Customer Ratings, Table Feedback, and Live Waiter Assistance Calls are exclusive to the Premium Restaurant Plan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left py-2">
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
            <div className="p-3.5 rounded-2xl bg-[#08080A] border border-white/[0.08] flex items-center space-x-3 text-xs text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Private Customer Ratings System</span>
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
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Customer Reviews & Table Service Calls</h1>
        <p className="text-xs text-gray-400 mt-1">
          Live feed of table assistance alerts and private ratings (Reviews auto-delete after 24 hours).
        </p>
      </div>

      {/* Waiter Calls Section */}
      <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
          <Bell className="w-5 h-5" />
          <span>Pending Table Assistance Requests ({waiterCalls.length})</span>
        </div>

        {waiterCalls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {waiterCalls.map((call) => (
              <div
                key={call._id}
                className="p-4 rounded-2xl bg-dark-base border border-dark-border flex items-center justify-between"
              >
                <div>
                  <span className="font-extrabold text-white text-sm">Table #{call.tableNumber}</span>
                  <span className="block text-xs text-gray-400 capitalize mt-0.5">{call.type} requested</span>
                  {call.note && <span className="block text-[11px] text-amber-400 mt-1">"{call.note}"</span>}
                  <span className="block text-[10px] text-gray-500 mt-1">
                    {new Date(call.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <button
                  onClick={() => handleResolve(call._id)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center space-x-1 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                >
                  <Check className="w-4 h-4" />
                  <span>Done</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No active waiter requests right now.</p>
        )}
      </div>

      {/* Customer Feedback List */}
      <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4">
        <div className="flex items-center space-x-2 text-white font-bold text-sm">
          <MessageSquare className="w-5 h-5 text-amber-400" />
          <span>Recent Customer Ratings ({feedbacks.length})</span>
        </div>

        {feedbacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map((fb) => (
              <div key={fb._id} className="p-5 rounded-2xl bg-dark-base border border-dark-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(fb.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-400">
                    {fb.tableNumber ? `Table #${fb.tableNumber}` : 'Dine-in'}
                  </span>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed italic">"{fb.comment || 'No written comment'}"</p>
                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-800">
                  <span className="font-medium">— {fb.customerName || 'Anonymous'}</span>
                  <span>{new Date(fb.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto opacity-30 text-amber-400" />
            <p className="text-xs">No customer feedback submitted in the last 24 hours.</p>
          </div>
        )}
      </div>
    </div>
  );
}
