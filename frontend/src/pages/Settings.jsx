import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState({
    dailyQuote: true,
    studyReminder: true,
    leaderboardInvites: true
  });
  const [privacy, setPrivacy] = useState({
    showOnLeaderboard: true,
    enableInvites: true
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">⚙️</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">User Information</h2>
            <p className="text-sm text-gray-600 mb-6">Update your profile details.</p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                Upload
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={user?.name || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition">
              Reset Password
            </button>
          </div>

          {/* Exam Preferences */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Exam Preferences</h2>
            <p className="text-sm text-gray-600 mb-6">Set your target exams, date and goals.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Exam(s)</label>
                <input
                  type="text"
                  value="GATE"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Date</label>
                <div className="relative">
                  <input
                    type="text"
                    value="Select date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    readOnly
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">📅</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Daily Study Goal (hours)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="8"
                  defaultValue="2"
                  className="flex-1"
                />
                <span className="text-lg font-semibold text-gray-900">2h</span>
              </div>
            </div>
          </div>

          {/* Customization */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Customization</h2>
            <p className="text-sm text-gray-600 mb-6">Tune your app experience.</p>
            
            <div className="space-y-6">
              {/* Theme */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Theme</h3>
                  <p className="text-sm text-gray-600">Light / Dark</p>
                </div>
                <button
                  onClick={() => setIsDarkTheme(!isDarkTheme)}
                  className={`w-12 h-6 rounded-full transition ${
                    isDarkTheme ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      isDarkTheme ? 'transform translate-x-6' : 'transform translate-x-0.5'
                    }`}
                  ></div>
                </button>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Language</h3>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>

              {/* Notifications */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Notifications</h3>
                <div className="space-y-3">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <button
                        onClick={() => handleNotificationChange(key)}
                        className={`w-10 h-5 rounded-full transition ${
                          value ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            value ? 'transform translate-x-5' : 'transform translate-x-0.5'
                          }`}
                        ></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Account & Privacy */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Account & Privacy</h2>
            <p className="text-sm text-gray-600 mb-6">Control visibility and data.</p>
            
            <div className="space-y-6">
              {Object.entries(privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {key === 'showOnLeaderboard' 
                        ? 'Allow others to see your rank and streak.'
                        : 'Let others invite you to rooms.'
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => handlePrivacyChange(key)}
                    className={`w-12 h-6 rounded-full transition ${
                      value ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        value ? 'transform translate-x-6' : 'transform translate-x-0.5'
                      }`}
                    ></div>
                  </button>
                </div>
              ))}

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
                  <span>📥</span>
                  Download My Data
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center gap-2">
                  <span>🗑️</span>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <p className="text-sm text-gray-700">
              💡 Small steps every day lead to big results. Keep going 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
