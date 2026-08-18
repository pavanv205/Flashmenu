import React, { useState } from 'react';
import { uploadAPI } from '../services/api';
import { Upload, X, Image as ImageIcon, CheckCircle2, RefreshCw } from 'lucide-react';

export default function ImageUploader({
  label = 'Image',
  imageUrl = '',
  imagePublicId = '',
  assetType = 'menu-items',
  onUploadSuccess,
  onRemove,
}) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpload = async (file) => {
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds 10MB limit!');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', assetType);

    setUploading(true);
    setErrorMsg('');

    try {
      const res = await uploadAPI.uploadImage(formData);
      if (res.data?.success && res.data?.image) {
        onUploadSuccess(res.data.image.url, res.data.image.publicId);
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
          {label}
        </label>
      )}

      {imageUrl ? (
        /* Image Preview State */
        <div className="relative group rounded-2xl overflow-hidden border border-dark-border bg-dark-base p-2 flex items-center space-x-3">
          <img
            src={imageUrl}
            alt="Uploaded preview"
            className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80';
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1 text-xs text-emerald-400 font-bold mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Cloudinary CDN Synced</span>
            </div>
            <p className="text-[11px] text-gray-400 truncate break-all font-mono">
              {imageUrl}
            </p>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <label className="p-2 rounded-xl bg-dark-card hover:bg-dark-hover text-gray-300 hover:text-white border border-dark-border cursor-pointer transition-all">
              <RefreshCw className={`w-4 h-4 ${uploading && 'animate-spin'}`} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                disabled={uploading}
                className="hidden"
              />
            </label>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Drag & Drop Dropzone */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-amber-500 bg-amber-500/10'
              : 'border-dark-border bg-dark-base hover:border-amber-500/40'
          }`}
        >
          <label className="cursor-pointer block space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
              {uploading ? (
                <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>
            <div className="text-xs text-gray-300">
              <span className="font-bold text-amber-400">Click to upload</span> or drag and drop
            </div>
            <p className="text-[10px] text-gray-500">JPG, PNG, WebP or AVIF (Max 10MB)</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      )}

      {errorMsg && <p className="text-xs text-red-400 font-semibold">{errorMsg}</p>}
    </div>
  );
}
