import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

const SystemMonitoring = () => {
  const { user } = useAuth();
  const [systemHealth, setSystemHealth] = useState({
    aiService: "healthy",
    database: "healthy",
    api: "healthy",
    storage: "healthy"
  });
  const [apiStats, setApiStats] = useState({
    totalCalls: 0,
    aiCalls: 0,
    cost: 0,
    errors: 0
  });
  const [activeSessions, setActiveSessions] = useState([]);
  const [errorLogs, setErrorLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemData();
    const interval = setInterval(fetchSystemData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemData = async () => {
    try {
      const [healthResponse, statsResponse, sessionsResponse, logsResponse] = await Promise.all([
        api.get("/api/v9/admin/system-health"),
        api.get("/api/v9/admin/api-stats"),
        api.get("/api/v9/admin/active-sessions"),
        api.get("/api/v9/admin/error-logs")
      ]);

      setSystemHealth(healthResponse.data.data);
      setApiStats(statsResponse.data.data);
      setActiveSessions(sessionsResponse.data.data);
      setErrorLogs(logsResponse.data.data);
    } catch (error) {
      console.error("Error fetching system data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (status) => {
    switch (status) {
      case "healthy": return "text-green-600 bg-green-100";
      case "warning": return "text-yellow-600 bg-yellow-100";
      case "error": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getHealthIcon = (status) => {
    switch (status) {
      case "healthy": return "✅";
      case "warning": return "⚠️";
      case "error": return "❌";
      default: return "❓";
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
          <span className="text-white font-bold text-sm">🔧</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">System Monitoring</h1>
        <div className="ml-auto text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* System Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">AI Service</h3>
            <span className="text-2xl">🤖</span>
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getHealthColor(systemHealth.aiService)}`}>
            <span>{getHealthIcon(systemHealth.aiService)}</span>
            <span className="text-sm font-medium capitalize">{systemHealth.aiService}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Database</h3>
            <span className="text-2xl">🗄️</span>
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getHealthColor(systemHealth.database)}`}>
            <span>{getHealthIcon(systemHealth.database)}</span>
            <span className="text-sm font-medium capitalize">{systemHealth.database}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">API</h3>
            <span className="text-2xl">🔌</span>
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getHealthColor(systemHealth.api)}`}>
            <span>{getHealthIcon(systemHealth.api)}</span>
            <span className="text-sm font-medium capitalize">{systemHealth.api}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Storage</h3>
            <span className="text-2xl">💾</span>
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getHealthColor(systemHealth.storage)}`}>
            <span>{getHealthIcon(systemHealth.storage)}</span>
            <span className="text-sm font-medium capitalize">{systemHealth.storage}</span>
          </div>
        </div>
      </div>

      {/* API Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total API Calls</h3>
            <span className="text-2xl">📊</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{apiStats.totalCalls.toLocaleString()}</div>
          <p className="text-sm text-gray-500">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">AI Calls</h3>
            <span className="text-2xl">🤖</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{apiStats.aiCalls.toLocaleString()}</div>
          <p className="text-sm text-gray-500">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Cost</h3>
            <span className="text-2xl">💰</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">${apiStats.cost.toFixed(2)}</div>
          <p className="text-sm text-gray-500">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Errors</h3>
            <span className="text-2xl">❌</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{apiStats.errors}</div>
          <p className="text-sm text-gray-500">This month</p>
        </div>
      </div>

      {/* Active Sessions and Error Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Sessions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions ({activeSessions.length})</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activeSessions.map((session, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-medium">
                    {session.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                  <p className="text-xs text-gray-500">
                    {session.user.role} • {session.ipAddress}
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  {session.lastActivity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Error Logs */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Error Logs</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {errorLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <div className="text-red-500 mt-1">❌</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{log.message}</p>
                  <p className="text-xs text-gray-500">
                    {log.type} • {log.timestamp}
                  </p>
                  <p className="text-xs text-gray-600 font-mono mt-1">{log.stack}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API Usage Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Usage Over Time</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {[120, 150, 180, 200, 160, 190, 220, 250, 210, 180, 160, 140].map((calls, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="bg-blue-500 w-full rounded-t transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${(calls / 250) * 200}px` }}
                title={`${calls} calls`}
              ></div>
              <span className="mt-2 text-xs text-gray-600 font-medium">
                {index + 1}h
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* System Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <div className="text-2xl mb-2">🔄</div>
            <div className="text-sm font-medium">Restart AI Service</div>
          </button>
          <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <div className="text-2xl mb-2">🧹</div>
            <div className="text-sm font-medium">Clear Cache</div>
          </button>
          <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium">Generate Report</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitoring;
