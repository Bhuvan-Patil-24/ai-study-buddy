import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    studyRooms: 0,
    activeRooms: 0,
    totalTests: 0,
    aiCalls: 0,
    dailyActiveUsers: 0,
    weeklyRetention: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all dashboard data
      const [usersResponse, roomsResponse, testsResponse, activityResponse] = await Promise.all([
        api.get("/v1/auth/users"),
        api.get("/api/v9/admin/study-rooms"),
        api.get("/api/v9/admin/mock-tests"),
        api.get("/api/v9/admin/activity")
      ]);

      setStats({
        totalUsers: usersResponse.data.data.users.length,
        activeUsers: usersResponse.data.data.activeUsers || 0,
        studyRooms: roomsResponse.data.data.totalRooms || 0,
        activeRooms: roomsResponse.data.data.activeRooms || 0,
        totalTests: testsResponse.data.data.totalTests || 0,
        aiCalls: testsResponse.data.data.aiCalls || 0,
        dailyActiveUsers: activityResponse.data.data.dailyActive || 0,
        weeklyRetention: activityResponse.data.data.retention || 0
      });

      setRecentActivity(activityResponse.data.data.recentActivity || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">👑</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="ml-auto text-sm text-gray-500">
          Welcome back, {user?.name}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
            <span className="text-2xl">👥</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
          <p className="text-sm text-gray-500">{stats.activeUsers} active today</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Study Rooms</h3>
            <span className="text-2xl">🏠</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.studyRooms}</div>
          <p className="text-sm text-gray-500">{stats.activeRooms} active now</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Mock Tests</h3>
            <span className="text-2xl">📝</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalTests}</div>
          <p className="text-sm text-gray-500">Total taken</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">AI Calls</h3>
            <span className="text-2xl">🤖</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.aiCalls}</div>
          <p className="text-sm text-gray-500">This month</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[65, 72, 58, 81, 76, 89, 95].map((value, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-blue-500 w-full rounded-t transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${(value / 100) * 200}px` }}
                  title={`${value} users`}
                ></div>
                <span className="mt-2 text-xs text-gray-600 font-medium">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Exam Preferences Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Preferences</h3>
          <div className="space-y-4">
            {[
              { name: 'GATE CS', percentage: 35, color: 'bg-blue-500' },
              { name: 'GATE EC', percentage: 28, color: 'bg-green-500' },
              { name: 'GATE ME', percentage: 20, color: 'bg-yellow-500' },
              { name: 'GATE CE', percentage: 17, color: 'bg-purple-500' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent activity
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <div className="text-2xl mb-2">👥</div>
            <div className="text-sm font-medium">Manage Users</div>
          </button>
          <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <div className="text-2xl mb-2">🏠</div>
            <div className="text-sm font-medium">Study Rooms</div>
          </button>
          <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <div className="text-2xl mb-2">📝</div>
            <div className="text-sm font-medium">Create Test</div>
          </button>
          <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium">View Analytics</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
