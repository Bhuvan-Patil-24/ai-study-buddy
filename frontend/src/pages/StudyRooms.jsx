import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const StudyRooms = () => {
  const { user, isAdmin } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState("JEE Physics");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to JEE Physics Room!",
      sender: "system",
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 2,
      text: "Let's focus on Electrostatics today. I recommend 3 practice problems on Gauss's Law.",
      sender: "Aarav Shah",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const availableRooms = [
    { name: "JEE Physics", members: 12, active: true },
    { name: "GATE CS", members: 8, active: true },
    { name: "UPSC Polity", members: 15, active: true }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: user?.name || "You",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">👥</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Study Rooms</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Rooms */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Rooms</h2>
            <div className="space-y-3">
              {availableRooms.map((room) => (
                <div
                  key={room.name}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    selectedRoom === room.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedRoom(room.name)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{room.name}</h3>
                      <p className="text-sm text-gray-500">{room.members} members</p>
                    </div>
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition">
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Create Room
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">{selectedRoom} Room</h3>
              <p className="text-sm text-gray-500">Active discussion</p>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === user?.name ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === user?.name
                        ? 'bg-blue-600 text-white'
                        : msg.sender === 'system'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {msg.sender !== 'system' && (
                      <p className="text-xs font-medium mb-1">{msg.sender}</p>
                    )}
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">AI Chat Summary</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Overview of the current discussion</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Auto</span>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Ref
            </button>
          </div>
        </div>
        <div className="text-gray-500 text-center py-8">
          No conversation yet.
        </div>
      </div>
    </div>
  );
};

export default StudyRooms;
