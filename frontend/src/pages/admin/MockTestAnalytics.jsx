import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

const MockTestAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalTests: 0,
    averageScore: 0,
    completionRate: 0,
    totalAttempts: 0
  });
  const [difficultyStats, setDifficultyStats] = useState([]);
  const [subjectPerformance, setSubjectPerformance] = useState([]);
  const [recentTests, setRecentTests] = useState([]);
  const [weakTopics, setWeakTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState("all");

  useEffect(() => {
    fetchAnalytics();
  }, [selectedGroup]);

  const fetchAnalytics = async () => {
    try {
      const [analyticsResponse, difficultyResponse, subjectResponse, testsResponse, topicsResponse] = await Promise.all([
        api.get(`/api/v9/admin/mock-test-analytics?group=${selectedGroup}`),
        api.get(`/api/v9/admin/difficulty-stats?group=${selectedGroup}`),
        api.get(`/api/v9/admin/subject-performance?group=${selectedGroup}`),
        api.get(`/api/v9/admin/recent-tests?group=${selectedGroup}`),
        api.get(`/api/v9/admin/weak-topics?group=${selectedGroup}`)
      ]);

      setAnalytics(analyticsResponse.data.data);
      setDifficultyStats(difficultyResponse.data.data);
      setSubjectPerformance(subjectResponse.data.data);
      setRecentTests(testsResponse.data.data);
      setWeakTopics(topicsResponse.data.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePushAdaptiveTest = async (topic, difficulty) => {
    try {
      await api.post("/api/v9/admin/push-adaptive-test", {
        topic,
        difficulty,
        group: selectedGroup
      });
      alert(`Adaptive test pushed for ${topic} (${difficulty})`);
    } catch (error) {
      console.error("Error pushing adaptive test:", error);
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
            <span className="text-white font-bold text-sm">📊</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mock Test Analytics</h1>
        </div>
        <div>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            <option value="gate-cs">GATE CS</option>
            <option value="gate-ec">GATE EC</option>
            <option value="gate-me">GATE ME</option>
            <option value="gate-ce">GATE CE</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Tests</h3>
            <span className="text-2xl">📝</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{analytics.totalTests}</div>
          <p className="text-sm text-gray-500">Available</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Average Score</h3>
            <span className="text-2xl">📈</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{analytics.averageScore}%</div>
          <p className="text-sm text-gray-500">Overall</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Completion Rate</h3>
            <span className="text-2xl">✅</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{analytics.completionRate}%</div>
          <p className="text-sm text-gray-500">Tests completed</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Attempts</h3>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{analytics.totalAttempts}</div>
          <p className="text-sm text-gray-500">This month</p>
        </div>
      </div>

      {/* Difficulty Performance and Subject Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Difficulty Level Performance</h3>
          <div className="space-y-4">
            {difficultyStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${
                    stat.difficulty === 'Easy' ? 'bg-green-500' :
                    stat.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                  <span className="text-sm font-medium text-gray-700">{stat.difficulty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        stat.difficulty === 'Easy' ? 'bg-green-500' :
                        stat.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${stat.averageScore}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{stat.averageScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
          <div className="space-y-4">
            {subjectPerformance.map((subject, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">{subject.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${subject.averageScore}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{subject.averageScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weak Topics and Recent Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weak Topics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weak Topics (Need Attention)</h3>
          <div className="space-y-3">
            {weakTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{topic.name}</p>
                  <p className="text-xs text-gray-500">Average: {topic.averageScore}%</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePushAdaptiveTest(topic.name, 'Easy')}
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Easy Test
                  </button>
                  <button
                    onClick={() => handlePushAdaptiveTest(topic.name, 'Medium')}
                    className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Medium Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tests */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Test Attempts</h3>
          <div className="space-y-3">
            {recentTests.map((test, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-lg">📝</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{test.title}</p>
                  <p className="text-xs text-gray-500">
                    by {test.user} • {test.score}% • {test.time}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  test.score >= 80 ? 'bg-green-100 text-green-800' :
                  test.score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {test.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Test Performance Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Performance Over Time</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {[75, 82, 68, 91, 85, 78, 88].map((score, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="bg-blue-500 w-full rounded-t transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${(score / 100) * 200}px` }}
                title={`${score}%`}
              ></div>
              <span className="mt-2 text-xs text-gray-600 font-medium">
                {['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Push Adaptive Tests */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Push Adaptive Tests</h3>
        <p className="text-gray-600 mb-4">Send targeted tests to specific groups based on performance data</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Struggling Students</h4>
            <p className="text-sm text-gray-600 mb-3">Students with scores below 60%</p>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Send Easy Tests
            </button>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Average Performers</h4>
            <p className="text-sm text-gray-600 mb-3">Students with scores 60-80%</p>
            <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
              Send Medium Tests
            </button>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">High Performers</h4>
            <p className="text-sm text-gray-600 mb-3">Students with scores above 80%</p>
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Send Hard Tests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTestAnalytics;
