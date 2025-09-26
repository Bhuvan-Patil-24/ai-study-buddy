import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const DailyPsychologyTest = ({ onClose, onComplete }) => {
  const { user } = useAuth();
  const [showTest, setShowTest] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [result, setResult] = useState(null);

  const questions = [
    {
      id: "energy",
      question: "How much energy do you have today?",
      options: [
        { value: "A", text: "A lot" },
        { value: "B", text: "Okay" },
        { value: "C", text: "Low" },
        { value: "D", text: "Almost none" }
      ]
    },
    {
      id: "motivation",
      question: "How motivated did you feel to do your tasks today?",
      options: [
        { value: "A", text: "Very motivated" },
        { value: "B", text: "Somewhat motivated" },
        { value: "C", text: "Struggled a lot" },
        { value: "D", text: "No motivation" }
      ]
    },
    {
      id: "sleep",
      question: "How was your sleep last night?",
      options: [
        { value: "A", text: "Restful" },
        { value: "B", text: "Slightly disturbed" },
        { value: "C", text: "Woke up often" },
        { value: "D", text: "Very poor / overslept" }
      ]
    },
    {
      id: "appetite",
      question: "How was your appetite today?",
      options: [
        { value: "A", text: "Normal" },
        { value: "B", text: "Slight change" },
        { value: "C", text: "Noticeably different" },
        { value: "D", text: "Extreme change" }
      ]
    },
    {
      id: "sadness",
      question: "How often did you feel sad or down today?",
      options: [
        { value: "A", text: "Not at all" },
        { value: "B", text: "A little" },
        { value: "C", text: "Quite a bit" },
        { value: "D", text: "Most of the day" }
      ]
    },
    {
      id: "enjoyment",
      question: "Did you enjoy things you usually like today?",
      options: [
        { value: "A", text: "Yes, fully" },
        { value: "B", text: "A little less" },
        { value: "C", text: "Hardly" },
        { value: "D", text: "Not at all" }
      ]
    },
    {
      id: "focus",
      question: "How was your focus today?",
      options: [
        { value: "A", text: "Very good" },
        { value: "B", text: "Slightly distracted" },
        { value: "C", text: "Distracted often" },
        { value: "D", text: "Couldn't focus" }
      ]
    },
    {
      id: "restlessness",
      question: "Did you feel slowed down or restless today?",
      options: [
        { value: "A", text: "Not at all" },
        { value: "B", text: "A little" },
        { value: "C", text: "Quite often" },
        { value: "D", text: "Almost all day" }
      ]
    },
    {
      id: "guilt",
      question: "Did you feel guilty, worthless, or like a failure today?",
      options: [
        { value: "A", text: "Not at all" },
        { value: "B", text: "A little" },
        { value: "C", text: "Often" },
        { value: "D", text: "Most of the day" }
      ]
    },
    {
      id: "lifeWorth",
      question: "Did you have thoughts like \"life isn't worth it\" today?",
      options: [
        { value: "A", text: "Never" },
        { value: "B", text: "Rarely" },
        { value: "C", text: "Sometimes" },
        { value: "D", text: "Often" }
      ]
    }
  ];

  useEffect(() => {
    checkTodayTestStatus();
  }, []);

  const checkTodayTestStatus = async () => {
    try {
      const response = await api.get("/v8/psychology/today-status");
      setTestCompleted(response.data.data.hasTakenToday);
      if (response.data.data.test) {
        setResult(response.data.data.test);
      }
    } catch (error) {
      console.error("Error checking test status:", error);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitTest = async () => {
    setLoading(true);
    try {
      const response = await api.post("/v8/psychology/submit", responses);
      setResult(response.data.data);
      setTestCompleted(true);
      setShowTest(false);
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Error submitting test. Please try again.");
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

  if (testCompleted && result) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{getStressLevelEmoji(result.stressLevel)}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Daily Check-in Complete!</h2>
            <p className="text-gray-600">Here's your wellness summary for today</p>
          </div>

          <div className="space-y-6">
            {/* Stress Level */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Stress Level</h3>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStressLevelColor(result.stressLevel)}`}>
                <span className="text-2xl">{getStressLevelEmoji(result.stressLevel)}</span>
                <span className="font-medium capitalize">{result.stressLevel}</span>
                <span className="text-sm">(Score: {result.score}/30)</span>
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💝 Your Daily Motivation</h3>
              <p className="text-gray-800 italic text-center">"{result.motivationalQuote}"</p>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                setShowTest(false);
                if (onComplete) onComplete();
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!showTest) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Daily Wellness Check-in</h2>
          <p className="text-gray-600 mb-6">
            Take a quick 2-minute assessment to track your mental well-being and get personalized support.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setShowTest(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Start Assessment
            </button>
            <button
              onClick={() => {
                setShowTest(false);
                if (onClose) onClose();
              }}
              className="w-full bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = responses[currentQ.id];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQ.question}</h2>
          <div className="space-y-3">
            {currentQ.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(currentQ.id, option.value)}
                className={`w-full p-4 text-left rounded-lg border-2 transition ${
                  responses[currentQ.id] === option.value
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                <span className="font-medium">{option.value})</span> {option.text}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={submitTest}
              disabled={!canProceed || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Submitting..." : "Submit Assessment"}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={!canProceed}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyPsychologyTest;
