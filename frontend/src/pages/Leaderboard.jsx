import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Leaderboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Global");

  const leaderboardData = [
    { rank: 1, name: "Aarav Shah", points: 12840, streak: 12, badges: ["🔥", "🎯", "📖"] },
    { rank: 2, name: "Isha Verma", points: 12010, streak: 10, badges: ["🎯", "👥"] },
    { rank: 3, name: "Bhuvan Patil", points: 11200, streak: 7, badges: ["🔥", "📖", "🎯"] },
    { rank: 4, name: "Rahul Mehta", points: 9800, streak: 5, badges: ["📖"] },
    { rank: 5, name: "Neha Gupta", points: 9500, streak: 8, badges: ["🔥", "👥"] },
  ];

  const weeklyChallenges = [
    { rank: 1, name: "Aarav Shah", points: 12840, medal: "🥇" },
    { rank: 2, name: "Isha Verma", points: 12010, medal: "🥈" },
    { rank: 3, name: "Bhuvan Patil", points: 11200, medal: "🥉" },
  ];

  const tabs = ["Global", "My Study Room", "Friends"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">🏆</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Ranks</h2>
                <p className="text-sm text-gray-600">Global and group leaderboards.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or points"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
                  <span>📤</span>
                  Share your rank
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === tab
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Leaderboard Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">#</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Total Points</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">🔥 Streak</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Badges</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((user) => (
                    <tr key={user.rank} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-semibold text-gray-900">{user.rank}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-900">{user.points.toLocaleString()}</td>
                      <td className="py-4 px-4 text-gray-600">{user.streak}d</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-1">
                          {user.badges.map((badge, index) => (
                            <span key={index} className="text-lg">{badge}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Weekly Challenges */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏆</span>
              <h2 className="text-lg font-semibold text-gray-900">Weekly Challenges</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">This week's top 3 performers.</p>

            <div className="space-y-4 mb-6">
              {weeklyChallenges.map((challenge) => (
                <div key={challenge.rank} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{challenge.medal}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{challenge.name}</p>
                    <p className="text-sm text-gray-600">{challenge.points.toLocaleString()} points</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress to next rank</span>
                <span className="text-sm text-gray-600">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            {/* Motivational Message */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
              <p className="text-sm font-medium text-gray-800">
                You're in the Top 10% 🚀 Keep it up!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
