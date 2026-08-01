import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Camera, User, Loader2 } from 'lucide-react';

interface ProfileData {
  name: string;
  age: string;
  location: string;
  address: string;
  pincode: string;
  email: string;
  phone: string;
  avatar_url?: string;
}

const AVATAR_BUCKET = 'user-profiles';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileData>({
    name: '', age: '', location: '', address: '',
    pincode: '', email: '', phone: '', avatar_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [tempProfile, setTempProfile] = useState<ProfileData>(profile);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ── Fetch profile ──────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) { setLoading(false); return; }

      const timeout = setTimeout(() => {
        console.warn('[Profile] Fetch timed out');
        setLoading(false);
      }, 8000);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        clearTimeout(timeout);

        if (error && error.code !== 'PGRST116') {
          console.error('[Profile] Error fetching profile:', error);
          setIsEditing(true);
        } else if (data) {
          setProfile(data);
          setTempProfile(data);
          if (data.avatar_url) setAvatarPreview(data.avatar_url);
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
      } catch (e) {
        clearTimeout(timeout);
        console.error('[Profile] Fetch error:', e);
        setIsEditing(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // ── Avatar upload ──────────────────────────────────────────
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate: image only, max 5 MB
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be smaller than 5 MB.' });
      return;
    }

    // Local preview immediately
    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);

    setUploadingAvatar(true);
    setMessage(null);

    try {
      const ext = file.name.split('.').pop() ?? 'jpg';
      // Structured path: user-profiles/{user_id}/avatar.{ext}
      const filePath = `${user.id}/avatar.${ext}`;

      // Upsert — overwrite previous avatar
      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(filePath);

      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`; // cache-bust

      // Persist URL to profile row
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ user_id: user.id, avatar_url: urlData.publicUrl }, { onConflict: 'user_id' });

      if (updateError) throw updateError;

      setAvatarPreview(publicUrl);
      setProfile(prev => ({ ...prev, avatar_url: urlData.publicUrl }));
      setTempProfile(prev => ({ ...prev, avatar_url: urlData.publicUrl }));
      setMessage({ type: 'success', text: 'Profile picture updated!' });
    } catch (err: any) {
      console.error('[Profile] Avatar upload error:', err);
      setAvatarPreview(profile.avatar_url ?? '');
      setMessage({ type: 'error', text: 'Failed to upload avatar. Please try again.' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ── Field changes ──────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({ ...prev, [name]: value }));
  };

  // ── Save profile ───────────────────────────────────────────
  const handleSave = async () => {
    if (!user || saving) return;
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          name: tempProfile.name,
          age: tempProfile.age,
          location: tempProfile.location,
          address: tempProfile.address,
          pincode: tempProfile.pincode,
          email: tempProfile.email,
          phone: tempProfile.phone,
          avatar_url: tempProfile.avatar_url ?? profile.avatar_url,
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('Error saving profile:', error);
        setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
      } else {
        setProfile(tempProfile);
        setIsEditing(false);
        setMessage({ type: 'success', text: '✅ Profile saved successfully!' });
      }
    } catch (error: unknown) {
      console.error('[Profile] Error saving:', error);
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => { setTempProfile(profile); setIsEditing(true); };
  const handleCancel = () => { setTempProfile(profile); setIsEditing(false); setMessage(null); };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <div className="w-8 h-8 border-4 border-honeybee-primary/30 border-t-honeybee-primary rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading profile…</p>
      </div>
    );
  }

  // ── Avatar component ───────────────────────────────────────
  const AvatarSection = () => (
    <div className="flex flex-col items-center gap-3 mb-6">
      <div className="relative group">
        {/* Avatar image or placeholder */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-honeybee-primary/20 bg-honeybee-primary/10 flex items-center justify-center shadow-lg">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Profile avatar"
              className="w-full h-full object-cover"
              onError={() => setAvatarPreview('')}
            />
          ) : (
            <User className="w-10 h-10 text-honeybee-primary/60" />
          )}
          {uploadingAvatar && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Upload button overlay — edit mode only */}
        {isEditing && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-honeybee-primary rounded-full flex items-center justify-center shadow-md hover:bg-honeybee-primary/90 transition-colors disabled:opacity-60"
            aria-label="Change profile picture"
          >
            <Camera className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {isEditing && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingAvatar}
          className="text-xs text-honeybee-primary underline underline-offset-2 hover:text-honeybee-secondary transition-colors disabled:opacity-60"
        >
          {uploadingAvatar ? 'Uploading…' : 'Change profile picture'}
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
        aria-label="Upload profile picture"
      />

      {user?.email && (
        <p className="text-xs text-gray-400">{user.email}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Profile</h2>

      {/* Status message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {message.text}
        </div>
      )}

      {isEditing ? (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <AvatarSection />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Name</label>
              <input
                type="text" name="name" value={tempProfile.name} onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white text-sm"
                placeholder="Your full name"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Age</label>
              <input
                type="number" name="age" value={tempProfile.age} onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white text-sm"
                placeholder="Your age"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">City / Location</label>
              <input
                type="text" name="location" value={tempProfile.location} onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white text-sm"
                placeholder="City or town"
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Pincode</label>
              <input
                type="text" name="pincode" value={tempProfile.pincode} onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white text-sm"
                placeholder="6-digit pincode"
                maxLength={6}
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
              <input
                type="email" name="email" value={tempProfile.email} onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white text-sm"
                placeholder="contact@email.com"
              />
            </div>

            {/* Phone */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone</label>
              <input
                type="tel" name="phone" value={tempProfile.phone} onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white text-sm"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Address</label>
              <textarea
                name="address" value={tempProfile.address} onChange={handleChange} rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white text-sm resize-none"
                placeholder="Street, area, district…"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button onClick={handleSave} className="w-full" variant="primary" disabled={saving}>
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                </span>
              ) : 'Save Profile'}
            </Button>
            <button
              onClick={handleCancel}
              className="w-full py-2 px-4 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* ── View mode ─────────────────────────────────────── */
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <AvatarSection />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            {[
              { label: 'Name', value: profile.name },
              { label: 'Age', value: profile.age },
              { label: 'Location', value: profile.location },
              { label: 'Pincode', value: profile.pincode },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-gray-900 text-sm">{value || <span className="text-gray-400 italic">Not set</span>}</p>
              </div>
            ))}
            {[
              { label: 'Email', value: profile.email },
              { label: 'Phone', value: profile.phone },
              { label: 'Address', value: profile.address },
            ].map(({ label, value }) => (
              <div key={label} className="md:col-span-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-gray-900 text-sm">{value || <span className="text-gray-400 italic">Not set</span>}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleEdit}
            className="mt-4 inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-honeybee-secondary hover:bg-black focus:outline-none transition-colors"
            aria-label="Edit Profile"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
