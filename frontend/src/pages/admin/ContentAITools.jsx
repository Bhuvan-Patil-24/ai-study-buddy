import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

const ContentAITools = () => {
  const { user } = useAuth();
  const [contentStats, setContentStats] = useState({
    totalNotes: 0,
    pdfUploads: 0,
    youtubeLinks: 0,
    ocrProcessed: 0,
    aiGenerations: 0,
    summaries: 0,
    quizzes: 0,
    flashcards: 0
  });
  const [popularTopics, setPopularTopics] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);
  const [aiUsage, setAiUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContentData();
  }, []);

  const fetchContentData = async () => {
    try {
      const [contentResponse, topicsResponse, uploadsResponse, aiResponse] = await Promise.all([
        api.get("/api/v9/admin/content-stats"),
        api.get("/api/v9/admin/popular-topics"),
        api.get("/api/v9/admin/recent-uploads"),
        api.get("/api/v9/admin/ai-usage")
      ]);

      setContentStats(contentResponse.data.data);
      setPopularTopics(topicsResponse.data.data);
      setRecentUploads(uploadsResponse.data.data);
      setAiUsage(aiResponse.data.data);
    } catch (error) {
      console.error("Error fetching content data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedQuiz = async (subject) => {
    try {
      await api.post("/api/v9/admin/seed-quiz", { subject });
      alert(`Quiz seeded successfully for ${subject}`);
    } catch (error) {
      console.error("Error seeding quiz:", error);
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
          <span className="text-white font-bold text-sm">📄</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Content & AI Tools</h1>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Notes</h3>
            <span className="text-2xl">📚</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{contentStats.totalNotes}</div>
          <p className="text-sm text-gray-500">All time</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">PDF Uploads</h3>
            <span className="text-2xl">📄</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{contentStats.pdfUploads}</div>
          <p className="text-sm text-gray-500">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">YouTube Links</h3>
            <span className="text-2xl">🎥</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{contentStats.youtubeLinks}</div>
          <p className="text-sm text-gray-500">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">OCR Processed</h3>
            <span className="text-2xl">🔍</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{contentStats.ocrProcessed}</div>
          <p className="text-sm text-gray-500">This month</p>
        </div>
      </div>

      {/* AI Generation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">AI Generations</h3>
            <span className="text-2xl">🤖</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{contentStats.aiGenerations}</div>
          <p className="text-sm text-gray-500">Total</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Summaries</h3>
            <span className="text-2xl">📝</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{contentStats.summaries}</div>
          <p className="text-sm text-gray-500">Generated</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Quizzes</h3>
            <span className="text-2xl">❓</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{contentStats.quizzes}</div>
          <p className="text-sm text-gray-500">Generated</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Flashcards</h3>
            <span className="text-2xl">🃏</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{contentStats.flashcards}</div>
          <p className="text-sm text-gray-500">Generated</p>
        </div>
      </div>

      {/* Popular Topics and Recent Uploads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Topics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Topics</h3>
          <div className="space-y-3">
            {popularTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">{topic.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(topic.count / Math.max(...popularTopics.map(t => t.count))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{topic.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Uploads</h3>
          <div className="space-y-3">
            {recentUploads.map((upload, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-lg">{upload.type === 'pdf' ? '📄' : upload.type === 'youtube' ? '🎥' : '📝'}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{upload.title}</p>
                  <p className="text-xs text-gray-500">by {upload.user} • {upload.time}</p>
                </div>
                <span className="text-xs text-gray-500">{upload.size}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Usage Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Usage Over Time</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {aiUsage.map((usage, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="bg-purple-500 w-full rounded-t transition-all duration-300 hover:bg-purple-600"
                style={{ height: `${(usage.count / Math.max(...aiUsage.map(u => u.count))) * 200}px` }}
                title={`${usage.count} calls`}
              ></div>
              <span className="mt-2 text-xs text-gray-600 font-medium">
                {usage.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Seed Official Quizzes */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seed Official Quizzes</h3>
        <p className="text-gray-600 mb-4">Create official quizzes and mock tests for all users</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['GATE CS', 'GATE EC', 'GATE ME', 'GATE CE'].map(subject => (
            <button
              key={subject}
              onClick={() => handleSeedQuiz(subject)}
              className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sm font-medium">{subject}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentAITools;
