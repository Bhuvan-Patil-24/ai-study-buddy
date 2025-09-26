import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

const LeaderboardControls = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [badges, setBadges] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [newBadge, setNewBadge] = useState({
    name: "",
    description: "",
    criteria: "",
    icon: "🏆",
    points: 0
  });
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    type: "weekly",
    reward: "",
    criteria: ""
  });

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const [leaderboardResponse, badgesResponse, challengesResponse, performersResponse] = await Promise.all([
        api.get("/api/v9/admin/leaderboard"),
        api.get("/api/v9/admin/badges"),
        api.get("/api/v9/admin/challenges"),
        api.get("/api/v9/admin/top-performers")
      ]);

      setLeaderboard(leaderboardResponse.data.data);
      setBadges(badgesResponse.data.data);
      setChallenges(challengesResponse.data.data);
      setTopPerformers(performersResponse.data.data);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSeason = async () => {
    if (window.confirm("Are you sure you want to reset the leaderboard season? This will reset all points.")) {
      try {
        await api.post("/api/v9/admin/reset-season");
        alert("Leaderboard season reset successfully!");
        fetchLeaderboardData();
      } catch (error) {
        console.error("Error resetting season:", error);
      }
    }
  };

  const handleCreateBadge = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/v9/admin/badges", newBadge);
      setNewBadge({ name: "", description: "", criteria: "", icon: "🏆", points: 0 });
      setShowBadgeModal(false);
      fetchLeaderboardData();
    } catch (error) {
      console.error("Error creating badge:", error);
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/v9/admin/challenges", newChallenge);
      setNewChallenge({ title: "", description: "", type: "weekly", reward: "", criteria: "" });
      setShowChallengeModal(false);
      fetchLeaderboardData();
    } catch (error) {
      console.error("Error creating challenge:", error);
    }
  };

  const handleAnnounceTopPerformers = async (period) => {
    try {
      await api.post("/api/v9/admin/announce-top-performers", { period });
      alert(`Top performers for ${period} announced successfully!`);
    } catch (error) {
      console.error("Error announcing top performers:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🏆</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Leaderboard & Gamification</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowChallengeModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            ➕ Create Challenge
          </button>
          <button
            onClick={() => setShowBadgeModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            🏆 Create Badge
          </button>
        </div>
      </div>

      {/* Leaderboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Participants</h3>
            <span className="text-2xl">👥</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{leaderboard.length}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Active Badges</h3>
            <span className="text-2xl">🎖</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{badges.length}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Active Challenges</h3>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{challenges.length}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Season Points</h3>
            <span className="text-2xl">⭐</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {leaderboard.reduce((total, user) => total + user.points, 0)}
          </div>
        </div>
      </div>

      {/* Top Performers and Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleAnnounceTopPerformers("week")}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Announce Week
              </button>
              <button
                onClick={() => handleAnnounceTopPerformers("month")}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                Announce Month
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏅"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                  <p className="text-xs text-gray-500">{performer.points} points</p>
                </div>
                <span className="text-xs text-gray-500">{performer.period}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Leaderboard */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Leaderboard</h3>
            <button
              onClick={handleResetSeason}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reset Season
            </button>
          </div>
          <div className="space-y-2">
            {leaderboard.slice(0, 10).map((user, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.badges} badges</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-blue-600">{user.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges Management */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Badge Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{badge.name}</h4>
                  <p className="text-xs text-gray-500">{badge.points} points</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
              <p className="text-xs text-gray-500">Criteria: {badge.criteria}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Challenges Management */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Challenge Management</h3>
        <div className="space-y-3">
          {challenges.map((challenge, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{challenge.title}</h4>
                <p className="text-sm text-gray-600">{challenge.description}</p>
                <p className="text-xs text-gray-500">Type: {challenge.type} • Reward: {challenge.reward}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                  Edit
                </button>
                <button className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Badge Modal */}
      {showBadgeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Badge</h2>
            <form onSubmit={handleCreateBadge} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Name</label>
                <input
                  type="text"
                  value={newBadge.name}
                  onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newBadge.description}
                  onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                  <input
                    type="text"
                    value={newBadge.icon}
                    onChange={(e) => setNewBadge({ ...newBadge, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="🏆"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                  <input
                    type="number"
                    value={newBadge.points}
                    onChange={(e) => setNewBadge({ ...newBadge, points: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Criteria</label>
                <input
                  type="text"
                  value={newBadge.criteria}
                  onChange={(e) => setNewBadge({ ...newBadge, criteria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Complete 10 quizzes"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBadgeModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Challenge Modal */}
      {showChallengeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Challenge</h2>
            <form onSubmit={handleCreateChallenge} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Challenge Title</label>
                <input
                  type="text"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newChallenge.type}
                    onChange={(e) => setNewChallenge({ ...newChallenge, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="special">Special</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reward</label>
                  <input
                    type="text"
                    value={newChallenge.reward}
                    onChange={(e) => setNewChallenge({ ...newChallenge, reward: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 100 points"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Criteria</label>
                <input
                  type="text"
                  value={newChallenge.criteria}
                  onChange={(e) => setNewChallenge({ ...newChallenge, criteria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Complete 5 mock tests"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowChallengeModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Create Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardControls;
