import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import {
  ShieldCheck,
  Store,
  Crown,
  Users,
  Search,
  ExternalLink,
  Trash2,
  CheckCircle2,
  XCircle,
  UserCheck,
  UserX,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState({
    totalRestaurants: 0,
    activeCount: 0,
    inactiveCount: 0,
    premiumCount: 0,
    basicCount: 0,
    restaurants: [],
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  // Security Password Modal State
  const [planModalTarget, setPlanModalTarget] = useState(null);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getRestaurants();
      setData(res.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleToggleStatus = async (restaurant) => {
    setUpdatingId(restaurant._id);
    try {
      await adminAPI.toggleStatus(restaurant._id);
      await fetchRestaurants();
    } catch (error) {
      alert('Failed to toggle status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteRestaurant = async (restaurant) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${restaurant.name}" and all associated menu items, categories, and customer data?`
      )
    )
      return;

    try {
      await adminAPI.deleteRestaurant(restaurant._id);
      await fetchRestaurants();
    } catch (error) {
      alert('Failed to delete restaurant');
    }
  };

  const filteredRestaurants = data.restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.owner?.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.owner?.name?.toLowerCase().includes(search.toLowerCase()) ||
      (r.city || '').toLowerCase().includes(search.toLowerCase());

    let matchesFilter = true;
    if (filterTab === 'active') matchesFilter = r.isActive;
    else if (filterTab === 'inactive') matchesFilter = !r.isActive;
    else if (filterTab === 'premium') matchesFilter = r.subscriptionPlan === 'premium';
    else if (filterTab === 'basic') matchesFilter = r.subscriptionPlan !== 'premium';

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-dark-card via-[#162238] to-dark-base border border-amber-500/30 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Master Admin Control Panel</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Super Admin Management System &bull; Control customer restaurants & subscription access
            </p>
          </div>
        </div>

        <button
          onClick={fetchRestaurants}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-dark-card border border-dark-border hover:border-amber-500 text-xs font-bold text-gray-300 hover:text-white transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Overview Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-3xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Registered</span>
            <Store className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-white">{data.totalRestaurants}</p>
          <span className="text-[11px] text-gray-500">Customer Restaurants</span>
        </div>

        <div className="p-5 rounded-3xl bg-dark-card border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Owners</span>
            <UserCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">{data.activeCount}</p>
          <span className="text-[11px] text-emerald-400/80 font-semibold">Online & Operating</span>
        </div>

        <div className="p-5 rounded-3xl bg-dark-card border border-red-500/30 space-y-2">
          <div className="flex items-center justify-between text-red-400">
            <span className="text-xs font-bold uppercase tracking-wider">Inactive Owners</span>
            <UserX className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-black text-red-400">{data.inactiveCount}</p>
          <span className="text-[11px] text-red-400/80 font-semibold">Paused / Offline</span>
        </div>

        <div className="p-5 rounded-3xl bg-dark-card border border-amber-500/30 space-y-2 gold-glow">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider">Premium Plan</span>
            <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400">{data.premiumCount}</p>
          <span className="text-[11px] text-amber-400/80 font-semibold">Active Subscriptions</span>
        </div>

        <div className="p-5 rounded-3xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Basic Plan</span>
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-white">{data.basicCount}</p>
          <span className="text-[11px] text-gray-500">Free Tier Customers</span>
        </div>
      </div>

      {/* Customer Restaurants Table */}
      <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Registered Customer Restaurants</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search restaurant or owner..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-dark-base border border-dark-border text-white text-xs focus:outline-none focus:border-amber-500 w-full sm:w-64"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap rounded-xl bg-dark-base p-1 border border-dark-border">
              {['all', 'active', 'inactive', 'premium', 'basic'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    filterTab === tab
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table List */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-xs">
            No restaurants found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-base border-b border-dark-border text-gray-400 uppercase text-[10px] font-extrabold tracking-wider">
                <tr>
                  <th className="p-4">Restaurant & Owner</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Owner Status</th>
                  <th className="p-4">Subscription Plan</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border text-gray-200 font-medium">
                {filteredRestaurants.map((r) => (
                  <tr key={r._id} className="hover:bg-dark-base/50 transition-colors">
                    <td className="p-4">
                      <div className="font-extrabold text-white text-sm">{r.name}</div>
                      <div className="text-[11px] text-amber-400 font-mono">flashmenu.com/menu/{r.slug}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">Owner: {r.owner?.name || 'N/A'}</div>
                    </td>
                    <td className="p-4">
                      <div>{r.owner?.email || r.email || 'N/A'}</div>
                      <div className="text-[11px] text-gray-400">{r.phone || r.owner?.phone || 'No phone'}</div>
                    </td>

                    {/* Active / Inactive Status Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(r)}
                        disabled={updatingId === r._id}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 border transition-all ${
                          r.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500 hover:text-black'
                            : 'bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500 hover:text-white'
                        }`}
                        title="Click to toggle Active / Inactive owner status"
                      >
                        {r.isActive ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>ACTIVE OWNER</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>INACTIVE OWNER</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Subscription Plan Toggle (Triggers Security Password Modal) */}
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setPlanModalTarget(r);
                          setAdminPasswordInput('');
                          setPasswordError('');
                        }}
                        disabled={updatingId === r._id}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 border transition-all ${
                          r.subscriptionPlan === 'premium'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500 hover:text-black'
                            : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500 hover:text-black'
                        }`}
                        title="Click to change subscription plan (Password required)"
                      >
                        {r.subscriptionPlan === 'premium' ? (
                          <>
                            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>PREMIUM</span>
                          </>
                        ) : (
                          <span>BASIC</span>
                        )}
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <a
                          href={`/menu/${r.slug}?preview=true`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-dark-base border border-dark-border text-amber-400 hover:bg-dark-hover font-bold flex items-center space-x-1"
                          title="Preview menu"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </a>

                        <button
                          onClick={() => handleDeleteRestaurant(r)}
                          className="p-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                          title="Delete restaurant"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Plan Security Password Verification Modal */}
      {planModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-dark-card border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center gold-glow">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white">Admin Security Password Required</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Enter admin security password to change subscription plan for <strong className="text-white">"{planModalTarget.name}"</strong> to{' '}
                <strong className={planModalTarget.subscriptionPlan === 'premium' ? 'text-cyan-400 font-black' : 'text-amber-400 font-black'}>
                  {planModalTarget.subscriptionPlan === 'premium' ? 'BASIC' : 'PREMIUM'}
                </strong>.
              </p>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
                {passwordError}
              </div>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setPasswordError('');
                try {
                  const targetId = planModalTarget._id;
                  const newPlan = planModalTarget.subscriptionPlan === 'premium' ? 'basic' : 'premium';
                  await adminAPI.updatePlan(targetId, newPlan, adminPasswordInput.trim());
                  setPlanModalTarget(null);
                  fetchRestaurants();
                } catch (err) {
                  setPasswordError(err.response?.data?.message || 'Invalid admin security password');
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1 text-left">
                  Admin Password *
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter security password"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500 font-mono text-center tracking-widest"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPlanModalTarget(null)}
                  className="flex-1 py-3 rounded-2xl bg-dark-base border border-dark-border text-gray-300 hover:text-white font-bold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all shadow-lg shadow-amber-500/20"
                >
                  Verify & Update Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
