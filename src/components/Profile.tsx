import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Button from './Button';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';

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
  const location = useLocation();

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
  const [isEditing, setIsEditing] = useState(true);
  const [tempProfile, setTempProfile] = useState<ProfileData>(profile);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, 'profile', 'oKBVdiB6yR4iiwacSWah');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as ProfileData;
          setProfile(data);
          setTempProfile(data);
          setIsEditing(false);
        } else {
          // Initialize with empty profile if no data exists
          setProfile({
            name: '',
            age: '',
            location: '',
            address: '',
            pincode: '',
            email: '',
            phone: '',
          });
          setTempProfile({
            name: '',
            age: '',
            location: '',
            address: '',
            pincode: '',
            email: '',
            phone: '',
          });
          setIsEditing(true);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) {
      alert('User not authenticated');
      return;
    }

    // Check if user is signed in with Google
    const isGoogleUser = user.providerData.some(provider => provider.providerId === 'google.com');
    if (!isGoogleUser) {
      alert('Profile saving is only available for Google users');
      return;
    }

    try {
      const docRef = doc(db, 'profile', 'oKBVdiB6yR4iiwacSWah');
      console.log('Saving profile data:', tempProfile);
      await setDoc(docRef, tempProfile, { merge: true });
      setProfile(tempProfile);
      setIsEditing(false);
      alert('Profile saved successfully!');
    } catch (error: unknown) {
      console.error('Error saving profile:', error);
      if (error instanceof Error && 'code' in error && error.code === 'permission-denied') {
        alert('Missing or insufficient permissions. Please ensure you are signed in and try again.');
      } else {
        alert('Failed to save profile. Please try again.');
      }
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
    return <div>Loading profile...</div>;
  }

  // Check if user is signed in with Google or in testing mode
  const isGoogleUser = user && user.providerData.some(provider => provider.providerId === 'google.com');
  const isTesting = localStorage.getItem('testingMode') === 'true';

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Profile</h2>

      {(!user && !isTesting) ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-center text-gray-600">
            {location.state?.message || 'Please sign in with Google to access your profile.'}
          </p>
        </div>
      ) : (!isGoogleUser && !isTesting) ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-center text-gray-600">
            {location.state?.message || 'Profile access is only available for Google users.'}
          </p>
        </div>
      ) : isEditing ? (
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  placeholder="Enter your full address"
                />
              </div>
            </div>

            <div className="group">
                <Button
                  onClick={handleSave}
                  className="w-full"
                  variant="primary"
                >
                  Save Profile
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
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
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
