import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import aiService from "../services/aiService";

const StressCheckModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const questions = [
    {
      id: 1,
      question: "How much energy do you have today?",
      options: ["A lot", "Okay", "Low", "Almost none"]
    },
    {
      id: 2,
      question: "How motivated did you feel to do your tasks today?",
      options: ["Very motivated", "Somewhat motivated", "Struggled a lot", "No motivation"]
    },
    {
      id: 3,
      question: "How was your sleep last night?",
      options: ["Restful", "Slightly disturbed", "Woke up often", "Very poor / overslept"]
    },
    {
      id: 4,
      question: "How was your appetite today?",
      options: ["Normal", "Slight change", "Noticeably different", "Extreme change"]
    },
    {
      id: 5,
      question: "How often did you feel sad or down today?",
      options: ["Not at all", "A little", "Quite a bit", "Most of the day"]
    },
    {
      id: 6,
      question: "Did you enjoy things you usually like today?",
      options: ["Yes, fully", "A little less", "Hardly", "Not at all"]
    },
    {
      id: 7,
      question: "How was your focus today?",
      options: ["Very good", "Slightly distracted", "Distracted often", "Couldn't focus"]
    },
    {
      id: 8,
      question: "Did you feel slowed down or restless today?",
      options: ["Not at all", "A little", "Quite often", "Almost all day"]
    },
    {
      id: 9,
      question: "Did you feel guilty, worthless, or like a failure today?",
      options: ["Not at all", "A little", "Often", "Most of the day"]
    },
    {
      id: 10,
      question: "Did you have thoughts like 'life isn't worth it' today?",
      options: ["Never", "Rarely", "Sometimes", "Often"]
    }
  ];

  const handleAnswer = (answer) => {
    const newResponses = {
      ...responses,
      [questions[currentQuestion].id]: answer
    };
    setResponses(newResponses);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit(newResponses);
    }
  };

  const handleSubmit = async (finalResponses) => {
    setLoading(true);
    try {
      await aiService.analyzeStressLevel(finalResponses);
      setCompleted(true);
      
      // Show motivational message after a delay
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error analyzing stress level:", error);
      alert("Error analyzing stress level. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentQuestion(0);
    setResponses({});
    setCompleted(false);
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!completed ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Daily Stress Check</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

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
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {questions[currentQuestion].question}
              </h3>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                  >
                    <span className="font-medium text-gray-700">{option}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="text-sm text-gray-500">
                {currentQuestion + 1} of {questions.length}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Assessment Complete!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for completing the stress check. Your responses have been analyzed and saved to your profile.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">
                <strong>Your stress level has been updated!</strong> This will help us personalize your study experience and provide better recommendations.
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Continue to Dashboard
            </button>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing your responses...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StressCheckModal;
