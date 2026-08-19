import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { restaurantAPI } from '../services/api';
import ImageUploader from '../components/ImageUploader';
import { Store, Palette, Save, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { restaurant, updateRestaurantState } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    logo: '',
    logoPublicId: '',
    coverImage: '',
    coverImagePublicId: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    googleMapsUrl: '',
    openingHours: '',
    cuisineType: '',
    primaryColor: '#F59E0B',
    secondaryColor: '#0F172A',
    currency: '₹',
    tableCount: 25,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        tagline: restaurant.tagline || '',
        description: restaurant.description || '',
        logo: restaurant.logo || '',
        logoPublicId: restaurant.logoPublicId || '',
        coverImage: restaurant.coverImage || '',
        coverImagePublicId: restaurant.coverImagePublicId || '',
        phone: restaurant.phone || '',
        email: restaurant.email || '',
        address: restaurant.address || '',
        city: restaurant.city || '',
        googleMapsUrl: restaurant.googleMapsUrl || '',
        openingHours: restaurant.openingHours || '',
        cuisineType: restaurant.cuisineType || '',
        primaryColor: restaurant.primaryColor || '#F59E0B',
        secondaryColor: restaurant.secondaryColor || '#0F172A',
        currency: restaurant.currency || '₹',
        tableCount: restaurant.tableCount || 25,
      });
    }
  }, [restaurant]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await restaurantAPI.updateMyRestaurant(formData);
      updateRestaurantState(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Restaurant Profile & Custom Branding</h1>
        <p className="text-xs text-gray-400">Configure logo, cover banner, and contact details</p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>Restaurant profile updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Store className="w-4 h-4 text-amber-400" />
            <span>Basic Restaurant Info</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Restaurant Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Cuisine Type
              </label>
              <input
                type="text"
                name="cuisineType"
                placeholder="e.g. North Indian & Fusion"
                value={formData.cuisineType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Tagline
              </label>
              <input
                type="text"
                name="tagline"
                placeholder="e.g. Scan Tap Dine"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Opening Hours
              </label>
              <input
                type="text"
                name="openingHours"
                placeholder="10:00 AM - 11:00 PM"
                value={formData.openingHours}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              name="description"
              placeholder="Tell customers about your story and specialties..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm"
            />
          </div>
        </div>

        {/* Media */}
        <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Palette className="w-4 h-4 text-amber-400" />
            <span>Images & Branding</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploader
              label="Restaurant Logo"
              imageUrl={formData.logo}
              imagePublicId={formData.logoPublicId}
              assetType="logo"
              onUploadSuccess={(url, publicId) => {
                setFormData((prev) => ({ ...prev, logo: url, logoPublicId: publicId }));
              }}
              onRemove={() => {
                setFormData((prev) => ({ ...prev, logo: '', logoPublicId: '' }));
              }}
            />

            <ImageUploader
              label="Cover Image Banner"
              imageUrl={formData.coverImage}
              imagePublicId={formData.coverImagePublicId}
              assetType="cover"
              onUploadSuccess={(url, publicId) => {
                setFormData((prev) => ({ ...prev, coverImage: url, coverImagePublicId: publicId }));
              }}
              onRemove={() => {
                setFormData((prev) => ({ ...prev, coverImage: '', coverImagePublicId: '' }));
              }}
            />
          </div>
        </div>

        {/* Location & Contact */}
        <div className="p-6 rounded-3xl bg-dark-card border border-dark-border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                City / Location
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Full Physical Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving Profile...' : 'Save Profile Changes'}</span>
        </button>
      </form>
    </div>
  );
}
