import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { MessageSquare, Star, Bell, Check } from 'lucide-react';

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [waiterCalls, setWaiterCalls] = useState([]);
  const [loading, setLoading] = useState(true);

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
