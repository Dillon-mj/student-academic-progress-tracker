import React, { useState } from 'react';

const Sidebar = ({ user, onProfileUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    photoURL: user.photoURL || '',
  });

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (file) {
      // For demo: create local preview URL
      const photoURL = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, photoURL }));
      // TODO: Upload to Firebase Storage and update user profile photoURL
    }
  };

  const saveProfile = () => {
    // TODO: Save profileData to Firebase (auth profile or database)
    onProfileUpdate(profileData);
    setEditingProfile(false);
  };

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md focus:outline-none"
        aria-label="Toggle sidebar"
      >
        {/* Simple hamburger icon */}
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 transform bg-gradient-to-b from-blue-700 via-blue-800 to-indigo-900 text-white shadow-lg transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex flex-col items-center border-b border-blue-600">
          {/* Profile Picture */}
          <img
            src={profileData.photoURL || '/default-profile.png'}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-white"
          />
          {/* Name and Email */}
          <h2 className="text-xl font-semibold">{profileData.name || 'Student Name'}</h2>
          <p className="text-sm opacity-75">{profileData.email || 'email@example.com'}</p>
          {/* Edit Profile Button */}
          <button
            onClick={() => setEditingProfile(true)}
            className="mt-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Edit Profile
          </button>
        </div>

        {/* Sidebar navigation items */}
        <nav className="p-6">
          <ul className="space-y-4">
            <li>
              <button className="w-full text-left hover:bg-blue-600 rounded px-3 py-2">
                Dashboard
              </button>
            </li>
            <li>
              <button className="w-full text-left hover:bg-blue-600 rounded px-3 py-2">
                Courses
              </button>
            </li>
            {/* Add more nav items here */}
          </ul>
        </nav>

        {/* Profile Edit Modal */}
        {editingProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 text-black relative">
              <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
              <label className="block mb-2">
                Name
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                />
              </label>
              <label className="block mb-2">
                Email
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                />
              </label>
              <label className="block mb-4">
                Profile Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full"
                />
              </label>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setEditingProfile(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
