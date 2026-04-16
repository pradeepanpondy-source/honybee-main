import React, { useState, useEffect } from 'react';
import Button from './Button';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface ProfileData {
  name: string;
  age: string;
  location: string;
  address: string;
  pincode: string;
  email: string;
  phone: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    age: '',
    location: '',
    address: '',
    pincode: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [tempProfile, setTempProfile] = useState<ProfileData>(profile);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) { setLoading(false); return; }

      // 8-second hard timeout so Profile never hangs
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

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
        });

      if (error) {
        console.error('Error saving profile:', error);
        setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
      } else {
        setProfile(tempProfile);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile saved successfully!' });
      }
    } catch (error: unknown) {
      console.error('[Profile] Error saving:', error);
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <div className="w-8 h-8 border-4 border-honeybee-primary/30 border-t-honeybee-primary rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading profile…</p>
      </div>
    );
  }



  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Profile</h2>
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-center ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-600' : 'bg-red-50 border border-red-200 text-red-600'}`}>
          {message.text}
        </div>
      )}

      {isEditing ? (
        <div className="group">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={tempProfile.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={tempProfile.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white"
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={tempProfile.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white"
                  placeholder="Enter your location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={tempProfile.pincode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white"
                  placeholder="Enter your pincode"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={tempProfile.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white"
                  placeholder="Enter your email"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={tempProfile.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  name="address"
                  value={tempProfile.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white"
                  placeholder="Enter your full address"
                />
              </div>
            </div>

            <div className="group">
              <Button
                onClick={handleSave}
                className="w-full"
                variant="primary"
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save Profile'}
              </Button>
              <button
                onClick={handleCancel}
                className="w-full mt-2 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Name</h3>
              <p className="text-gray-900">{profile.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Age</h3>
              <p className="text-gray-900">{profile.age}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Location</h3>
              <p className="text-gray-900">{profile.location}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Pincode</h3>
              <p className="text-gray-900">{profile.pincode}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold text-gray-700">Email</h3>
              <p className="text-gray-900">{profile.email}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold text-gray-700">Phone</h3>
              <p className="text-gray-900">{profile.phone}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold text-gray-700">Address</h3>
              <p className="text-gray-900">{profile.address}</p>
            </div>
          </div>
          <button
            onClick={handleEdit}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-honeybee-secondary hover:bg-black focus:outline-none transition-colors"
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
