import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Mock user data
  const user = {
    name: "Thomas Student",
    email: "student@thomascollege.edu",
    profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
    totalReviews: 5,
    memberSince: "Nov 2025",
    notifications: {
      mealReminders: true,
      newItems: true,
      weeklyDigest: false
    },
    preferences: {
      theme: "dark",
      showImages: true,
      autoRefresh: true
    }
  };

  const handleLogOut = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      // Add logout logic here
      alert("Logged out successfully!");
      // In real app: clear auth token, redirect to login
    }
  };

  return (
    <div className="app-container min-h-screen pb-24">
      <header className="header px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="logo-gradient text-2xl font-bold">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account settings</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Profile Header */}
        <div className="meal-card p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <img 
              src={user.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-primary-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100/1a1a1a/f97316?text=TC';
              }}
            />
            <div>
              <h2 className="text-3xl font-bold text-white">{user.name}</h2>
              <p className="text-gray-400 mt-1">{user.email}</p>
            </div>
          </div>

          <button 
            onClick={() => setShowEditProfile(true)}
            className="px-6 py-2 bg-gradient-orange text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Edit Profile
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="meal-card p-4">
            <p className="text-gray-400 text-xs uppercase mb-1">Total Reviews</p>
            <p className="text-3xl font-bold text-white">{user.totalReviews}</p>
          </div>
          <div className="meal-card p-4">
            <p className="text-gray-400 text-xs uppercase mb-1">Member Since</p>
            <p className="text-lg font-bold text-primary-400">{user.memberSince}</p>
          </div>
        </div>

        {/* Settings Section */}
        <div className="meal-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Settings</h3>
          <div className="space-y-4">
            <button 
              onClick={() => setShowNotifications(true)}
              className="w-full flex items-center justify-between p-4 bg-dark-100 rounded-2xl border border-gray-800 hover:border-primary-500/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="text-white font-semibold">Notifications</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button 
              onClick={() => setShowPreferences(true)}
              className="w-full flex items-center justify-between p-4 bg-dark-100 rounded-2xl border border-gray-800 hover:border-primary-500/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span className="text-white font-semibold">Preferences</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button 
              onClick={() => setShowPrivacy(true)}
              className="w-full flex items-center justify-between p-4 bg-dark-100 rounded-2xl border border-gray-800 hover:border-primary-500/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-white font-semibold">Privacy</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button 
              onClick={handleLogOut}
              className="w-full flex items-center justify-between p-4 bg-dark-100 rounded-2xl border border-red-900/40 hover:border-red-500/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-red-500 font-semibold">Log Out</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-dark-100 rounded-3xl p-6 max-w-md w-full border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Edit Profile</h3>
              <button onClick={() => setShowEditProfile(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={user.name}
                  className="w-full bg-dark-50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Email</label>
                <input 
                  type="email" 
                  defaultValue={user.email}
                  className="w-full bg-dark-50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
              <button className="w-full py-3 bg-gradient-orange text-white rounded-full font-semibold hover:opacity-90">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-dark-100 rounded-3xl p-6 max-w-md w-full border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Notifications</h3>
              <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
                <span className="text-white">Meal Reminders</span>
                <input type="checkbox" defaultChecked={user.notifications.mealReminders} className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
                <span className="text-white">New Menu Items</span>
                <input type="checkbox" defaultChecked={user.notifications.newItems} className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
                <span className="text-white">Weekly Digest</span>
                <input type="checkbox" defaultChecked={user.notifications.weeklyDigest} className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-dark-100 rounded-3xl p-6 max-w-md w-full border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Preferences</h3>
              <button onClick={() => setShowPreferences(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
                <span className="text-white">Dark Theme</span>
                <input type="checkbox" defaultChecked={user.preferences.theme === "dark"} className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
                <span className="text-white">Show Food Images</span>
                <input type="checkbox" defaultChecked={user.preferences.showImages} className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
                <span className="text-white">Auto-Refresh Menu</span>
                <input type="checkbox" defaultChecked={user.preferences.autoRefresh} className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-dark-100 rounded-3xl p-6 max-w-md w-full border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Privacy Settings</h3>
              <button onClick={() => setShowPrivacy(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 text-gray-300">
              <p className="text-sm">Your reviews are anonymous by default. Only your ratings and comments are visible to other users.</p>
              <div className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
                <span className="text-white">Public Profile</span>
                <input type="checkbox" defaultChecked={false} className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
                <span className="text-white">Show Review History</span>
                <input type="checkbox" defaultChecked={false} className="w-5 h-5" />
              </div>
              <button className="w-full py-3 bg-primary-500 text-white rounded-full font-semibold hover:opacity-90 mt-4">
                Save Privacy Settings
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        <Link to="/" className="nav-item">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/schedule" className="nav-item">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">Schedule</span>
        </Link>
        <Link to="/history" className="nav-item">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs">History</span>
        </Link>
        <div className="nav-item active">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span className="text-xs">Profile</span>
        </div>
      </nav>
    </div>
  );
}