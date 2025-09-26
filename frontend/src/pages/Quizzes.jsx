import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Quizzes = () => {
  const { isAdmin } = useAuth();
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const quizzes = [
    {
      id: 1,
      title: "GATE Mathematics",
      description: "Algebra, Calculus & Linear Algebra",
      questions: 25,
      time: "60 min",
      difficulty: "Medium",
      score: 92,
      status: "Completed",
      category: "Mathematics"
    },
    {
      id: 2,
      title: "GATE Computer Science",
      description: "Data Structures & Algorithms",
      questions: 30,
      time: "90 min",
      difficulty: "Hard",
      score: 85,
      status: "Completed",
      category: "Computer Science"
    },
    {
      id: 3,
      title: "GATE Physics",
      description: "Mechanics & Thermodynamics",
      questions: 20,
      time: "45 min",
      difficulty: "Medium",
      score: 0,
      status: "Not Started",
      category: "Physics"
    },
    {
      id: 4,
      title: "GATE Chemistry",
      description: "Organic & Inorganic Chemistry",
      questions: 25,
      time: "60 min",
      difficulty: "Medium",
      score: 0,
      status: "Not Started",
      category: "Chemistry"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">✏️</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Quizzes & Mock Tests</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Quizzes</h3>
            <span className="text-2xl">📝</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">24</div>
          <p className="text-sm text-gray-500">Available</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Completed</h3>
            <span className="text-2xl">✅</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">8</div>
          <p className="text-sm text-gray-500">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Average Score</h3>
            <span className="text-2xl">📊</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">87%</div>
          <p className="text-sm text-gray-500">Great job!</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Streak</h3>
            <span className="text-2xl">🔥</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">5</div>
          <p className="text-sm text-gray-500">Days</p>
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {quiz.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{quiz.description}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {quiz.category}
                </span>
              </div>
              <span className={`text-2xl ${
                quiz.status === "Completed" ? "text-green-500" : "text-gray-400"
              }`}>
                {quiz.status === "Completed" ? "✅" : "📝"}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Questions:</span>
                <span className="font-medium">{quiz.questions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{quiz.time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Difficulty:</span>
                <span className={`font-medium ${
                  quiz.difficulty === "Easy" ? "text-green-600" :
                  quiz.difficulty === "Medium" ? "text-yellow-600" : "text-red-600"
                }`}>
                  {quiz.difficulty}
                </span>
              </div>
              {quiz.score > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Score:</span>
                  <span className="font-semibold text-blue-600">{quiz.score}%</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedQuiz(quiz)}
              className={`w-full py-3 rounded-lg font-medium transition ${
                quiz.status === "Completed"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {quiz.status === "Completed" ? "Retake Quiz" : "Start Quiz"}
            </button>
          </div>
        ))}
      </div>

      {/* Quiz Modal */}
      {selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📝</span>
              <h2 className="text-2xl font-bold text-gray-900">{selectedQuiz.title}</h2>
            </div>
            
            <p className="text-gray-600 mb-6">{selectedQuiz.description}</p>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Questions:</span>
                <span className="font-semibold">{selectedQuiz.questions}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Time Limit:</span>
                <span className="font-semibold">{selectedQuiz.time}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Difficulty:</span>
                <span className={`font-semibold ${
                  selectedQuiz.difficulty === "Easy" ? "text-green-600" :
                  selectedQuiz.difficulty === "Medium" ? "text-yellow-600" : "text-red-600"
                }`}>
                  {selectedQuiz.difficulty}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Category:</span>
                <span className="font-semibold">{selectedQuiz.category}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedQuiz(null)}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle quiz start
                  setSelectedQuiz(null);
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-gray-800 font-medium">
              Practice makes perfect! Take regular quizzes to track your progress and identify areas for improvement.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Each quiz helps you get closer to your GATE exam goals. Keep going! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;