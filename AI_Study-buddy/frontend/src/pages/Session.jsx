import { useState } from "react";

const fakeSessions = [
  { id: 1, topic: "Doubt Solving", duration: 30, status: "scheduled" },
  { id: 2, topic: "Math Revision", duration: 45, status: "completed" },
  { id: 3, topic: "Physics Live", duration: 60, status: "scheduled" },
];

const Session = () => {
  const [sessions, setSessions] = useState(fakeSessions);
  const [newSession, setNewSession] = useState({
    topic: "",
    duration: 30,
    type: "one-on-one",
  });

  const handleCreateSession = (e) => {
    e.preventDefault();
    setSessions([
      {
        id: Date.now(),
        topic: newSession.topic,
        duration: newSession.duration,
        status: "scheduled",
      },
      ...sessions,
    ]);
    setNewSession({ topic: "", duration: 30, type: "one-on-one" });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-purple-700 mb-4">
        Session Management
      </h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Start New Session</h2>
        <form onSubmit={handleCreateSession} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-medium">Topic</label>
            <input
              type="text"
              value={newSession.topic}
              onChange={(e) =>
                setNewSession({
                  ...newSession,
                  topic: e.target.value,
                })
              }
              required
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Duration (minutes)</label>
            <select
              value={newSession.duration}
              onChange={(e) =>
                setNewSession({
                  ...newSession,
                  duration: Number(e.target.value),
                })
              }
              className="border border-gray-300 rounded px-4 py-2 w-full"
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-purple-700 text-white rounded py-2 font-semibold hover:bg-purple-800 transition"
          >
            Create Session
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Sessions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-lg">{session.topic}</h3>
              <div className="flex justify-between text-gray-600 mt-2">
                <span>Duration: {session.duration} mins</span>
                <span>Status: {session.status}</span>
              </div>
              <button
                className={`mt-4 px-4 py-2 rounded text-white font-semibold ${
                  session.status === "scheduled"
                    ? "bg-purple-700 hover:bg-purple-800"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={session.status !== "scheduled"}
              >
                Join Session
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Session;
