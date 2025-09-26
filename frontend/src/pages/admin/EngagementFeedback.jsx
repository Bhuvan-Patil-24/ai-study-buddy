import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

const EngagementFeedback = () => {
  const { user } = useAuth();
  const [engagement, setEngagement] = useState({
    dailyActiveUsers: 0,
    weeklyActiveUsers: 0,
    monthlyActiveUsers: 0,
    retentionRate: 0,
    averageSessionTime: 0,
    bounceRate: 0
  });
  const [feedback, setFeedback] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [engagementChart, setEngagementChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  useEffect(() => {
    fetchEngagementData();
  }, [selectedPeriod]);

  const fetchEngagementData = async () => {
    try {
      const [engagementResponse, feedbackResponse, complaintsResponse, chartResponse] = await Promise.all([
        api.get(`/api/v9/admin/engagement?period=${selectedPeriod}`),
        api.get("/api/v9/admin/feedback"),
        api.get("/api/v9/admin/complaints"),
        api.get(`/api/v9/admin/engagement-chart?period=${selectedPeriod}`)
      ]);

      setEngagement(engagementResponse.data.data);
      setFeedback(feedbackResponse.data.data);
      setComplaints(complaintsResponse.data.data);
      setEngagementChart(chartResponse.data.data);
    } catch (error) {
      console.error("Error fetching engagement data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackResponse = async (feedbackId, response) => {
    try {
      await api.put(`/api/v9/admin/feedback/${feedbackId}/respond`, { response });
      setFeedback(feedback.map(f => 
        f._id === feedbackId ? { ...f, responded: true, adminResponse: response } : f
      ));
    } catch (error) {
      console.error("Error responding to feedback:", error);
    }
  };

  const handleComplaintResolution = async (complaintId, resolution) => {
    try {
      await api.put(`/api/v9/admin/complaints/${complaintId}/resolve`, { resolution });
      setComplaints(complaints.map(c => 
        c._id === complaintId ? { ...c, resolved: true, resolution } : c
      ));
    } catch (error) {
      console.error("Error resolving complaint:", error);
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
            <span className="text-white font-bold text-sm">📈</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Engagement & Feedback</h1>
        </div>
        <div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Daily Active Users</h3>
            <span className="text-2xl">👥</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{engagement.dailyActiveUsers}</div>
          <p className="text-sm text-gray-500">Today</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Retention Rate</h3>
            <span className="text-2xl">🔄</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{engagement.retentionRate}%</div>
          <p className="text-sm text-gray-500">7-day retention</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Avg Session Time</h3>
            <span className="text-2xl">⏱️</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{engagement.averageSessionTime}m</div>
          <p className="text-sm text-gray-500">Per session</p>
        </div>
      </div>

      {/* Engagement Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement Over Time</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {engagementChart.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="bg-blue-500 w-full rounded-t transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${(data.users / Math.max(...engagementChart.map(d => d.users))) * 200}px` }}
                title={`${data.users} users`}
              ></div>
              <span className="mt-2 text-xs text-gray-600 font-medium">
                {data.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback and Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Feedback */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Feedback ({feedback.length})</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {feedback.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.user.name}</p>
                    <p className="text-xs text-gray-500">{item.timestamp}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.responded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.responded ? 'Responded' : 'Pending'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{item.message}</p>
                {item.responded ? (
                  <div className="text-xs text-gray-600 bg-white p-2 rounded">
                    <strong>Admin Response:</strong> {item.adminResponse}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const response = prompt("Enter your response:");
                        if (response) handleFeedbackResponse(item._id, response);
                      }}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Respond
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Complaints */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints ({complaints.length})</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {complaints.map((complaint, index) => (
              <div key={index} className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{complaint.user.name}</p>
                    <p className="text-xs text-gray-500">{complaint.timestamp}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    complaint.resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {complaint.resolved ? 'Resolved' : 'Open'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{complaint.message}</p>
                <p className="text-xs text-gray-600 mb-2">
                  <strong>Category:</strong> {complaint.category}
                </p>
                {complaint.resolved ? (
                  <div className="text-xs text-gray-600 bg-white p-2 rounded">
                    <strong>Resolution:</strong> {complaint.resolution}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const resolution = prompt("Enter resolution:");
                        if (resolution) handleComplaintResolution(complaint._id, resolution);
                      }}
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Resolve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Insights */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Top Performing Features</h4>
            <div className="space-y-2">
              {[
                { name: "Mock Tests", usage: 85, trend: "+12%" },
                { name: "Study Rooms", usage: 72, trend: "+8%" },
                { name: "Notes & Summaries", usage: 68, trend: "+15%" },
                { name: "Psychology Tests", usage: 45, trend: "+5%" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{feature.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${feature.usage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{feature.usage}%</span>
                    <span className="text-xs text-green-600">{feature.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">User Behavior Patterns</h4>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Peak Usage Time</p>
                <p className="text-xs text-blue-700">7:00 PM - 10:00 PM</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-900">Most Active Day</p>
                <p className="text-xs text-green-700">Sunday</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-900">Average Session</p>
                <p className="text-xs text-yellow-700">45 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <div className="text-2xl mb-2">📧</div>
            <div className="text-sm font-medium">Send Newsletter</div>
          </button>
          <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium">Export Data</div>
          </button>
          <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm font-medium">Run A/B Test</div>
          </button>
          <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <div className="text-2xl mb-2">📈</div>
            <div className="text-sm font-medium">View Reports</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EngagementFeedback;
