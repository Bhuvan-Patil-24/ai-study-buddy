import { useState } from "react";

const fakeQuizzes = [
  {
    id: 1,
    title: "Math Quiz",
    description: "Algebra & Geometry",
    score: 92,
    totalQuestions: 10,
    status: "Completed",
  },
  {
    id: 2,
    title: "Physics Quiz",
    description: "Mechanics",
    score: 85,
    totalQuestions: 8,
    status: "Completed",
  },
  {
    id: 3,
    title: "Chemistry Quiz",
    description: "Organic Chemistry",
    score: 78,
    totalQuestions: 12,
    status: "Ongoing",
  },
  {
    id: 4,
    title: "Biology Quiz",
    description: "Genetics",
    score: 0,
    totalQuestions: 10,
    status: "Not Started",
  },
];

const fakeStats = {
  completed: 2,
  ongoing: 1,
  average: 85,
};

const Quizzes = () => {
  const [quizzes] = useState(fakeQuizzes);
  const [stats] = useState(fakeStats);

  return (
    <div>
      <h1 className="text-2xl font-bold text-purple-700 mb-4">
        Quiz Analytics
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h3 className="font-semibold text-lg">Completed</h3>
          <p className="text-2xl text-purple-700">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h3 className="font-semibold text-lg">Ongoing</h3>
          <p className="text-2xl text-purple-700">{stats.ongoing}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h3 className="font-semibold text-lg">Average Score</h3>
          <p className="text-2xl text-purple-700">{stats.average}%</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Quizzes</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-lg">{quiz.title}</h3>
              <p className="text-gray-600">{quiz.description}</p>
              <div className="flex justify-between text-gray-600 mt-2">
                <span>Score: {quiz.score}%</span>
                <span>Questions: {quiz.totalQuestions}</span>
              </div>
              <button
                className={`mt-4 px-4 py-2 rounded text-white font-semibold ${
                  quiz.status === "Completed"
                    ? "bg-green-500"
                    : quiz.status === "Ongoing"
                    ? "bg-blue-500"
                    : "bg-yellow-500"
                }`}
              >
                {quiz.status}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
