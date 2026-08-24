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
  KeyRound,
  RefreshCw,
  Eye,
  EyeOff,
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

  // Secret Code Modal State for Plan and Owner Status
  const [modalTarget, setModalTarget] = useState(null); // { restaurant, action: 'plan' | 'status' }
  const [secretCodeInput, setSecretCodeInput] = useState('');
  const [secretCodeError, setSecretCodeError] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [createOwnerMsg, setCreateOwnerMsg] = useState('');

  // Create Restaurant Owner Modal State (Zero Fees + Mandatory 2FA)
  const [createOwnerModalOpen, setCreateOwnerModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    restaurantName: '',
    city: 'Visakhapatnam',
    subscriptionPlan: 'basic_lifetime',
    requires2FA: true,
    secretCode: '',
  });
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResendOwnerOTP = async () => {
    if (resendCooldown > 0 || resendLoading) return;
    setCreateError('');
    setCreateSuccess('');
    setResendLoading(true);
    try {
      const pin = (createForm.secretCode || '2193').trim();
      const res = await adminAPI.sendCreateOwnerOTP(pin, createForm.email, createForm.phone);
      setCreateSuccess(res.data.message || 'Fresh 2FA Security Code sent to Master Admin email!');
      setResendCooldown(30);
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to resend 2FA Security Code.');
    } finally {
      setResendLoading(false);
    }
  };

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

  const handleDeleteRestaurant = async (restaurant) => {
    if (restaurant.slug === 'master-admin-vip') {
      alert('Master Admin Headquarters cannot be deleted.');
      return;
    }

    const pinInput = window.prompt(
      `SECURITY AUTHORIZATION REQUIRED:\nTo permanently delete "${restaurant.name}" and all associated customer data, enter your Master Security PIN Key (e.g. 2193):`
    );

    if (!pinInput) return;

    const cleanPin = pinInput.trim();
    if (cleanPin !== '2193' && cleanPin !== 'Pavan@2193') {
      alert('Invalid Master Security PIN Key. Account deletion cancelled.');
      return;
    }

    try {
      setUpdatingId(restaurant._id);
      const res = await adminAPI.deleteRestaurant(restaurant._id, cleanPin);
      await fetchRestaurants();
      alert(res.data?.message || `Restaurant "${restaurant.name}" deleted successfully.`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete restaurant');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRestaurants = data.restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.owner?.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.owner?.name?.toLowerCase().includes(search.toLowerCase()) ||
      (r.city || '').toLowerCase().includes(search.toLowerCase());

    const isPremium = String(r.subscriptionPlan || '').toLowerCase().includes('premium');

    let matchesFilter = true;
    if (filterTab === 'active') matchesFilter = r.isActive;
    if (filterTab === 'inactive') matchesFilter = !r.isActive;
    if (filterTab === 'premium') matchesFilter = isPremium;
    if (filterTab === 'basic') matchesFilter = !isPremium;

    return matchesSearch && matchesFilter;
  });

  const handleOpenModal = (restaurant, action) => {
    setModalTarget({ restaurant, action });
    setSecretCodeInput('');
    setSecretCodeError('');
    setPinVerified(false);
    setOtpInput('');
    setCreateOwnerMsg('');
  };

  const handleConfirmModalAction = async (e) => {
    e.preventDefault();
    setSecretCodeError('');
    setCreateOwnerMsg('');

    try {
      if (modalTarget.action === 'create_owner') {
        if (!pinVerified) {
          // STEP 1: Verify PIN Key & Send 2FA Code to Admin Email
          if (secretCodeInput.trim() !== '2193' && secretCodeInput.trim() !== 'Pavan@2193') {
            setSecretCodeError('Invalid Master Admin Security PIN Key. Access Denied.');
            return;
          }
          setCreateLoading(true);
          const res = await adminAPI.sendCreateOwnerOTP(secretCodeInput.trim());
          setPinVerified(true);
          setCreateOwnerMsg(res.data.message || '2FA Security Code sent to pavanvadapalli205@gmail.com');
          setCreateLoading(false);
          return;
        } else {
          // STEP 2: Verify 2FA OTP Code & Create Zero-Fee Restaurant Owner Account
          if (!otpInput.trim()) {
            setSecretCodeError('Please enter the 6-digit 2FA security code.');
            return;
          }
          setCreateLoading(true);
          const payload = { ...createForm, secretCode: otpInput.trim() };
          const res = await adminAPI.createOwner(payload);
          setModalTarget(null);
          setCreateOwnerModalOpen(false);
          setPinVerified(false);
          setOtpInput('');
          setCreateForm({
            name: '',
            email: '',
            password: '',
            phone: '',
            restaurantName: '',
            city: 'Visakhapatnam',
            subscriptionPlan: 'basic_lifetime',
            requires2FA: true,
            secretCode: '',
          });
          await fetchRestaurants();
          alert(res.data.message || 'Restaurant Owner account created successfully with Zero Fees and Mandatory 2FA!');
          setCreateLoading(false);
          return;
        }
      }

      if (secretCodeInput.trim() !== '2193' && secretCodeInput.trim() !== 'Pavan@2193') {
        setSecretCodeError('Invalid Master Admin Security Key. Access Denied.');
        return;
      }

      setUpdatingId(modalTarget.restaurant._id);
      if (modalTarget.action === 'plan') {
        const isCurrentPremium = String(modalTarget.restaurant.subscriptionPlan || '').toLowerCase().includes('premium');
        const newPlan = isCurrentPremium ? 'basic_lifetime' : 'premium_lifetime';
        await adminAPI.updatePlan(modalTarget.restaurant._id, newPlan, secretCodeInput);
      } else {
        await adminAPI.toggleStatus(modalTarget.restaurant._id, secretCodeInput);
      }
      await fetchRestaurants();
      setModalTarget(null);
    } catch (error) {
      setSecretCodeError(error.response?.data?.message || 'Action failed.');
    } finally {
      setUpdatingId(null);
      setCreateLoading(false);
    }
  };

  const handleCreateOwnerSubmit = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');

    if (!createForm.name || !createForm.email || !createForm.password || !createForm.restaurantName) {
      setCreateError('Please fill out all required fields (Name, Email, Password, Restaurant Name).');
      return;
    }

    if (createForm.phone) {
      let cleanPhone = createForm.phone.replace(/\D/g, '');
      if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) cleanPhone = cleanPhone.slice(1);
      if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) cleanPhone = cleanPhone.slice(2);

      if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
        setCreateError('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9 (e.g. 9885064713).');
        return;
      }
      if (/^(\d)\1{9}$/.test(cleanPhone)) {
        setCreateError('Invalid phone number. Repetitive dummy numbers (e.g. 0000000000) are not allowed.');
        return;
      }
    }

    if (!pinVerified) {
      // Step 1: Verify PIN & Send 2FA OTP to Master Admin Email
      const pin = (createForm.secretCode || '').trim();
      if (!pin) {
        setCreateError('Please enter the Master Security PIN Key.');
        return;
      }

      if (pin !== '2193' && pin !== 'Pavan@2193') {
        setCreateError('Invalid Master Security PIN Key. Access Denied.');
        return;
      }

      try {
        setCreateLoading(true);
        const res = await adminAPI.sendCreateOwnerOTP(pin, createForm.email, createForm.phone);
        setPinVerified(true);
        setCreateSuccess(res.data.message || '2FA Security Code sent to Master Admin email pavanvadapalli205@gmail.com!');
      } catch (err) {
        setCreateError(err.response?.data?.message || 'Failed to send 2FA Security Code.');
      } finally {
        setCreateLoading(false);
      }
    } else {
      // Step 2: Verify 2FA OTP & Create Zero-Fee Restaurant Owner Account
      const otp = (otpInput || '').trim();
      if (!otp) {
        setCreateError('Please enter the 6-digit 2FA security code sent to your email.');
        return;
      }

      try {
        setCreateLoading(true);
        const payload = { ...createForm, secretCode: otp };
        const res = await adminAPI.createOwner(payload);
        setCreateSuccess(res.data.message || 'Restaurant Owner account created successfully with Zero Fees and 2FA!');
        setTimeout(() => {
          setCreateOwnerModalOpen(false);
          setPinVerified(false);
          setOtpInput('');
          setCreateForm({
            name: '',
            email: '',
            password: '',
            phone: '',
            restaurantName: '',
            city: 'Visakhapatnam',
            subscriptionPlan: 'basic_lifetime',
            requires2FA: true,
            secretCode: '',
          });
          setCreateSuccess('');
          fetchRestaurants();
        }, 1500);
      } catch (err) {
        setCreateError(err.response?.data?.message || 'Failed to create owner account.');
      } finally {
        setCreateLoading(false);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-8 rounded-3xl bg-[#0E0E14] border border-white/[0.07]">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Master Admin Control Panel</h1>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/40">
                MASTER ADMIN
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Customer Restaurant Operations • Security Verified as{' '}
              <span className="text-amber-400 font-bold">pavanvadapalli205@gmail.com</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setCreateOwnerModalOpen(true);
              setCreateError('');
              setCreateSuccess('');
            }}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>+ Create Owner (Zero Fees & 2FA)</span>
          </button>

          <button
            onClick={fetchRestaurants}
            disabled={loading}
            className="px-4 py-2.5 rounded-full bg-[#08080A] border border-white/[0.08] text-xs font-bold text-gray-300 hover:text-white hover:border-amber-500/50 transition-all flex items-center space-x-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-3xl bg-[#0E0E14] border border-white/[0.07] space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Portal Accounts</span>
            <Store className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-white">{data.totalRestaurants}</p>
          <span className="text-[11px] text-gray-400">Customer Restaurants</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0E0E14] border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Owners</span>
            <UserCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">{data.activeCount}</p>
          <span className="text-[11px] text-emerald-400/80 font-semibold">Online & Operating</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0E0E14] border border-red-500/30 space-y-2">
          <div className="flex items-center justify-between text-red-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Inactive Owners</span>
            <UserX className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-black text-red-400">{data.inactiveCount}</p>
          <span className="text-[11px] text-red-400/80 font-semibold">Paused / Offline</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0E0E14] border border-amber-500/40 space-y-2 gold-glow">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Premium Plan</span>
            <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400">{data.premiumCount}</p>
          <span className="text-[11px] text-amber-400/80 font-semibold">Active Subscriptions</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0E0E14] border border-white/[0.07] space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Basic Plan</span>
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-white">{data.basicCount}</p>
          <span className="text-[11px] text-gray-400">Free Tier Customers</span>
        </div>
      </div>

      {/* Customer Restaurants Table */}
      <div className="p-6 rounded-3xl bg-[#0E0E14] border border-white/[0.07] space-y-6">
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
                className="pl-9 pr-4 py-2 rounded-full bg-[#08080A] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-amber-500 w-full sm:w-64 font-medium"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 p-1 rounded-full bg-[#08080A] border border-white/[0.08]">
              {['all', 'active', 'inactive', 'premium', 'basic'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                    filterTab === tab
                      ? 'bg-amber-500 text-black shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08080A] text-gray-400 font-bold uppercase tracking-wider border-b border-white/[0.08]">
              <tr>
                <th className="p-4">Restaurant</th>
                <th className="p-4">Owner Info</th>
                <th className="p-4">Plan Tier</th>
                <th className="p-4">Owner Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredRestaurants.length > 0 ? (
                filteredRestaurants.map((resItem) => (
                  <tr key={resItem._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold flex items-center justify-center">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-extrabold text-white text-xs">{resItem.name}</p>
                          <a
                            href={`/menu/${resItem.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-amber-400 font-bold hover:underline inline-flex items-center space-x-1"
                          >
                            <span>/{resItem.slug}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-gray-200">{resItem.owner?.name || 'N/A'}</p>
                        <p className="text-gray-400 text-[11px]">{resItem.owner?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {(() => {
                        const isPrem = String(resItem.subscriptionPlan || '').toLowerCase().includes('premium');
                        return (
                          <button
                            onClick={() => handleOpenModal(resItem, 'plan')}
                            disabled={updatingId === resItem._id}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center space-x-1.5 border ${
                              isPrem
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                                : 'bg-dark-base text-gray-400 border-dark-border hover:bg-gray-800 hover:text-white'
                            }`}
                          >
                            <Crown className="w-3 h-3 text-amber-400" />
                            <span>{isPrem ? 'PREMIUM' : 'BASIC'}</span>
                            <KeyRound className="w-3 h-3 text-amber-400 ml-1" />
                          </button>
                        );
                      })()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleOpenModal(resItem, 'status')}
                        disabled={updatingId === resItem._id}
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center space-x-1.5 border ${
                          resItem.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30'
                        }`}
                      >
                        {resItem.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{resItem.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                        <KeyRound className="w-3 h-3 ml-1" />
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      {resItem.slug === 'master-admin-vip' ? (
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider px-2.5 py-1 bg-white/5 rounded-lg border border-white/10">
                          Protected
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDeleteRestaurant(resItem)}
                          disabled={updatingId === resItem._id}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-colors disabled:opacity-50"
                          title="Delete Restaurant"
                        >
                          {updatingId === resItem._id ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-red-400" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 text-xs">
                    No restaurants matched your search filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Master Admin Verification Modal */}
      {modalTarget && (
        <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E0E14] border border-amber-500/40 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 text-white">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Master Admin Authorization Required</h3>
              <p className="text-xs text-gray-400">
                You are {modalTarget.action === 'create_owner' ? 'creating a Zero-Fee Owner Account' : modalTarget.action === 'plan' ? 'modifying Subscription Tier' : 'modifying Owner Account Status'} for{' '}
                <span className="text-amber-400 font-bold">{modalTarget.restaurant?.name || 'Restaurant'}</span>.
              </p>
            </div>

            {secretCodeError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
                {secretCodeError}
              </div>
            )}

            {createOwnerMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
                {createOwnerMsg}
              </div>
            )}

            <form onSubmit={handleConfirmModalAction} className="space-y-4">
              {modalTarget.action === 'create_owner' && pinVerified ? (
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    ENTER 6-DIGIT 2FA CODE (SENT TO MAIL)
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Enter 6-Digit 2FA Code"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-amber-500/50 text-amber-400 text-base font-mono tracking-widest font-black text-center focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[11px] text-gray-400 mt-1 text-center">
                    Check <span className="text-amber-400 font-bold">pavanvadapalli205@gmail.com</span> for your 2FA code.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Master Security PIN Key
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter PIN Key"
                    value={secretCodeInput}
                    onChange={(e) => setSecretCodeInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-amber-500/50 text-amber-400 text-sm font-mono tracking-widest font-black focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalTarget(null);
                    setPinVerified(false);
                    setOtpInput('');
                  }}
                  className="py-3 rounded-full bg-[#08080A] border border-white/[0.08] text-gray-400 hover:text-white font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20"
                >
                  {createLoading
                    ? 'Processing...'
                    : modalTarget.action === 'create_owner'
                    ? pinVerified
                      ? 'Verify Code & Create Account'
                      : 'Verify PIN & Send 2FA Code →'
                    : 'Confirm & Apply Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Restaurant Owner Modal (Zero Fees + Mandatory 2FA) */}
      {createOwnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#0E0E14] border border-amber-500/40 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Create Restaurant Owner Account</h3>
                  <p className="text-xs text-amber-400 font-semibold">Zero Fees • Mandatory 2FA Security Enabled</p>
                </div>
              </div>
              <button
                onClick={() => setCreateOwnerModalOpen(false)}
                className="text-gray-400 hover:text-white text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
                {createError}
              </div>
            )}

            {createSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
                {createSuccess}
              </div>
            )}

            <form onSubmit={handleCreateOwnerSubmit} autoComplete="off" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Owner Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chef Rajesh Kumar"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080A] border border-white/10 text-white text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Owner Email *</label>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    placeholder="e.g. rajesh@spicegarden.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    style={{ WebkitBoxShadow: '0 0 0px 1000px #08080A inset', WebkitTextFillColor: '#ffffff' }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080A] border border-white/10 text-white text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showOwnerPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      placeholder="Owner Login Password"
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      style={{ WebkitBoxShadow: '0 0 0px 1000px #08080A inset', WebkitTextFillColor: '#ffffff' }}
                      className="w-full px-3.5 pr-10 py-2.5 rounded-xl bg-[#08080A] border border-white/10 text-white text-xs focus:border-amber-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                      title={showOwnerPassword ? 'Hide password' : 'View password'}
                    >
                      {showOwnerPassword ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number (e.g. 9885064713)"
                    value={createForm.phone}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length === 11 && val.startsWith('0')) val = val.slice(1);
                      if (val.length === 12 && val.startsWith('91')) val = val.slice(2);
                      setCreateForm({ ...createForm, phone: val.slice(0, 10) });
                    }}
                    style={{ WebkitBoxShadow: '0 0 0px 1000px #08080A inset', WebkitTextFillColor: '#ffffff' }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080A] border border-white/10 text-white text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Restaurant Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spice Garden Restaurant"
                    value={createForm.restaurantName}
                    onChange={(e) => setCreateForm({ ...createForm, restaurantName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080A] border border-white/10 text-white text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Visakhapatnam"
                    value={createForm.city}
                    onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080A] border border-white/10 text-white text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Subscription Plan Tier</label>
                  <select
                    value={createForm.subscriptionPlan}
                    onChange={(e) => setCreateForm({ ...createForm, subscriptionPlan: e.target.value })}
                    style={{ WebkitBoxShadow: '0 0 0px 1000px #08080A inset', WebkitTextFillColor: '#fbbf24' }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080A] border border-amber-500/40 text-amber-400 font-bold text-xs focus:border-amber-500 focus:outline-none"
                  >
                    <option value="basic_lifetime">BASIC PLAN (Zero Fees - Lifetime Access)</option>
                    <option value="basic_6months">BASIC PLAN (Zero Fees - 6 Months Plan)</option>
                    <option value="premium_lifetime">PREMIUM VIP PLAN (Zero Fees - Lifetime Access)</option>
                    <option value="premium_6months">PREMIUM VIP PLAN (Zero Fees - 6 Months VIP Plan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Security Requirement</label>
                  <div className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl bg-[#08080A] border border-amber-500/30 text-xs">
                    <input
                      type="checkbox"
                      id="requires2FA"
                      checked={createForm.requires2FA}
                      onChange={(e) => setCreateForm({ ...createForm, requires2FA: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <label htmlFor="requires2FA" className="text-amber-400 font-bold cursor-pointer">
                      Mandatory 2FA Security Code
                    </label>
                  </div>
                </div>
              </div>

              {!pinVerified ? (
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Master Security PIN Key *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter Master Security PIN (e.g. 2193)"
                    value={createForm.secretCode}
                    onChange={(e) => setCreateForm({ ...createForm, secretCode: e.target.value })}
                    style={{ WebkitBoxShadow: '0 0 0px 1000px #08080A inset', WebkitTextFillColor: '#ffffff' }}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080A] border border-amber-500/50 text-amber-400 text-xs font-mono font-black focus:border-amber-500 focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    ENTER 6-DIGIT 2FA CODE (SENT TO MAIL) *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    autoComplete="one-time-code"
                    placeholder="Enter 6-Digit 2FA Security Code"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    style={{ WebkitBoxShadow: '0 0 0px 1000px #08080A inset', WebkitTextFillColor: '#ffffff' }}
                    className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-amber-500/50 text-amber-400 text-base font-mono font-black text-center focus:border-amber-500 focus:outline-none"
                  />
                  <div className="flex items-center justify-between mt-2 px-1">
                    <span className="text-[11px] text-gray-400">Didn't receive 2FA code?</span>
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || resendLoading}
                      onClick={handleResendOwnerOTP}
                      className="text-xs text-amber-400 font-bold hover:underline disabled:opacity-50 disabled:no-underline flex items-center space-x-1"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`} />
                      <span>
                        {resendLoading
                          ? 'Resending...'
                          : resendCooldown > 0
                          ? `Resend Code in ${resendCooldown}s`
                          : 'Resend 2FA Code'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCreateOwnerModalOpen(false);
                    setPinVerified(false);
                    setOtpInput('');
                  }}
                  className="py-3 rounded-full bg-[#08080A] border border-white/[0.08] text-gray-400 hover:text-white font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20"
                >
                  {createLoading
                    ? 'Processing...'
                    : pinVerified
                    ? 'Verify 2FA & Create Account'
                    : 'Verify PIN & Send 2FA Code →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
