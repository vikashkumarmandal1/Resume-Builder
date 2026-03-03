const inputClass =
  'mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500';

import { useState } from 'react';
import { uploadProfilePhoto, deleteProfilePhoto } from '../../api/client';

export default function StepProfile({ data, update, dossierId }) {
  const p = data.profile || {};
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const result = await uploadProfilePhoto(dossierId, file);
      update('profile.photoUrl', result.photoUrl);
    } catch (error) {
      setUploadError(error.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoDelete = async () => {
    if (!p.photoUrl) return;

    setUploading(true);
    setUploadError('');

    try {
      await deleteProfilePhoto(dossierId);
      update('profile.photoUrl', undefined);
    } catch (error) {
      setUploadError(error.message || 'Failed to delete photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Candidate profile</h2>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 overflow-hidden shadow-sm">
        <div className="p-6 grid sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Profile Photo</span>
            <div className="mt-2 flex items-start gap-4">
              <div className="relative">
                {p.photoUrl ? (
                  <div className="relative">
                    <img
                      src={p.photoUrl}
                      alt="Profile"
                      className="h-32 w-32 rounded-lg object-cover border border-slate-300 dark:border-slate-600"
                    />
                    <button
                      type="button"
                      onClick={handlePhotoDelete}
                      disabled={uploading}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 text-xs disabled:opacity-50"
                      title="Delete photo"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="h-32 w-32 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <span className="text-xs text-slate-500 dark:text-slate-400 text-center px-2">
                      No photo
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="inline-block px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium cursor-pointer disabled:opacity-50 transition-colors"
                  style={{ pointerEvents: uploading ? 'none' : 'auto', opacity: uploading ? 0.5 : 1 }}
                >
                  {uploading ? 'Uploading...' : 'Choose Photo'}
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Max 5MB, JPG/PNG/GIF
                </p>
                {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
              </div>
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
            <input
              type="email"
              value={p.email || ''}
              onChange={(e) => update('profile.email', e.target.value)}
              className={inputClass}
              placeholder="email@example.com"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</span>
            <input
              type="text"
              value={p.phone || ''}
              onChange={(e) => update('profile.phone', e.target.value)}
              className={inputClass}
              placeholder="+91 ..."
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</span>
            <input
              type="text"
              value={p.location || ''}
              onChange={(e) => update('profile.location', e.target.value)}
              className={inputClass}
              placeholder="City, Country"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Role / Track</span>
            <input
              type="text"
              value={p.role || ''}
              onChange={(e) => update('profile.role', e.target.value)}
              className={inputClass}
              placeholder="e.g. Programmer Analyst"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Cognizant ID</span>
            <input
              type="text"
              value={p.cognizantId || ''}
              onChange={(e) => update('profile.cognizantId', e.target.value)}
              className={inputClass}
              placeholder="e.g. 123456"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Track</span>
            <input
              type="text"
              value={p.track || ''}
              onChange={(e) => update('profile.track', e.target.value)}
              className={inputClass}
              placeholder="e.g. GenC Elevate"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">LinkedIn</span>
            <input
              type="url"
              value={p.linkedIn || ''}
              onChange={(e) => update('profile.linkedIn', e.target.value)}
              className={inputClass}
              placeholder="https://linkedin.com/in/..."
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">GitHub</span>
            <input
              type="url"
              value={p.github || ''}
              onChange={(e) => update('profile.github', e.target.value)}
              className={inputClass}
              placeholder="https://github.com/..."
            />
          </label>
        </div>
      </div>
    </section>
  );
}
