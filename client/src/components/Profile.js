import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';

const Profile = ({ user, onBack }) => {
  const [profileName, setProfileName] = useState(user?.displayName || '');
  const [profilePhotoURL, setProfilePhotoURL] = useState(user?.photoURL || '');
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setProfileName(user?.displayName || '');
    setProfilePhotoURL(user?.photoURL || '');
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      setProfilePhotoURL(URL.createObjectURL(file));
    }
  };

  const saveProfileChanges = async () => {
    setSaving(true);
    const auth = getAuth();
    if (!auth.currentUser) return;

    try {
      // TODO: Upload profilePhotoFile to Firebase Storage and get URL, then update photoURL here
      await updateProfile(auth.currentUser, {
        displayName: profileName,
        photoURL: profilePhotoURL,
      });
      alert('Profile updated successfully!');
      onBack(); // Navigate back after save
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow mt-8">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
      <label className="block mb-2 font-semibold">Name</label>
      <input
        type="text"
        value={profileName}
        onChange={(e) => setProfileName(e.target.value)}
        className="w-full rounded px-3 py-2 mb-4 border border-gray-300"
      />
      <label className="block mb-2 font-semibold">Profile Picture</label>
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="w-full mb-4"
      />
      {profilePhotoURL && (
        <img
          src={profilePhotoURL}
          alt="Preview"
          className="w-32 h-32 rounded-full object-cover mb-4"
        />
      )}
      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
          disabled={saving}
        >
          Cancel
        </button>
        <button
          onClick={saveProfileChanges}
          className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
