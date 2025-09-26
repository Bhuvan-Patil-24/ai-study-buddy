import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { psychologyService } from "../services/psychologyService";

const Wellness = () => {
  const { user, isStudent } = useAuth();
  const [testHistory, setTestHistory] = useState([]);
  const [stressTrends, setStressTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isStudent()) {
      fetchWellnessData();
    }
  }, [isStudent]);

  const fetchWellnessData = async () => {
    try {
      const [historyResponse, trendsResponse] = await Promise.all([
        psychologyService.getTestHistory(30),
        psychologyService.getStressTrends(7)
      ]);

      setTestHistory(historyResponse.data.data.tests);
      setStressTrends(trendsResponse.data.data.trends);
    } catch (error) {
      console.error("Error fetching wellness data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStressLevelColor = (level) => {
    switch (level) {
      case "low": return "text-green-600 bg-green-100";
      case "moderate": return "text-yellow-600 bg-yellow-100";
      case "high": return "text-orange-600 bg-orange-100";
      case "severe": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStressLevelEmoji = (level) => {
    switch (level) {
      case "low": return "😊";
      case "moderate": return "😐";
      case "high": return "😟";
      case "severe": return "😰";
      default: return "😐";
    }
  };

  if (!isStudent()) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🧠</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Wellness Dashboard</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600">This feature is only available for students.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🧠</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Wellness Dashboard</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">🧠</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Wellness Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Tests Taken</h3>
            <span className="text-2xl">📊</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{testHistory.length}</div>
          <p className="text-sm text-gray-500">Last 30 days</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Average Score</h3>
            <span className="text-2xl">📈</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {testHistory.length > 0 
              ? Math.round(testHistory.reduce((sum, test) => sum + test.score, 0) / testHistory.length)
              : 0
            }
          </div>
          <p className="text-sm text-gray-500">Out of 30</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Current Level</h3>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="text-lg font-bold text-gray-900 capitalize">
            {testHistory.length > 0 ? testHistory[0].stressLevel : "N/A"}
          </div>
          <p className="text-sm text-gray-500">Latest assessment</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Streak</h3>
            <span className="text-2xl">🔥</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {testHistory.length > 0 ? Math.min(testHistory.length, 7) : 0}
          </div>
          <p className="text-sm text-gray-500">Days</p>
        </div>
      </div>

      {/* Recent Tests */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Assessments</h2>
        {testHistory.length > 0 ? (
          <div className="space-y-4">
            {testHistory.slice(0, 5).map((test, index) => (
              <div key={test._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{getStressLevelEmoji(test.stressLevel)}</div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(test.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">Score: {test.score}/30</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStressLevelColor(test.stressLevel)}`}>
                  {test.stressLevel}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-gray-600">No assessments taken yet</p>
            <p className="text-sm text-gray-500">Take your first wellness assessment to get started</p>
          </div>
        )}
      </div>

      {/* Stress Trends Chart */}
      {stressTrends.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">7-Day Stress Trend</h2>
          <div className="flex items-end justify-between h-40 space-x-2">
            {stressTrends.map((trend, index) => {
              const height = (trend.score / 30) * 120; // Scale to chart height
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      trend.stressLevel === "low" ? "bg-green-500" :
                      trend.stressLevel === "moderate" ? "bg-yellow-500" :
                      trend.stressLevel === "high" ? "bg-orange-500" : "bg-red-500"
                    }`}
                    style={{ height: `${height}px` }}
                    title={`${trend.stressLevel} (${trend.score}/30)`}
                  ></div>
                  <span className="mt-2 text-xs text-gray-600 font-medium">
                    {new Date(trend.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💙</span>
          <div>
            <p className="text-gray-800 font-medium">
              Your mental health matters. Regular check-ins help you stay balanced and focused.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Remember: It's okay to not be okay. Seeking help is a sign of strength, not weakness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wellness;
