import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import studyRoomService from "../services/studyRoomService";

const StudyRooms = () => {
  const { user, isAdmin } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: "",
    description: "",
    subject: "",
    difficulty: "beginner",
    maxMembers: 10
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await studyRoomService.getRooms({ isActive: true });
      setRooms(response.data.rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId) => {
    try {
      const response = await studyRoomService.getMessages(roomId);
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      await studyRoomService.createRoom(newRoom);
      setNewRoom({ name: "", description: "", subject: "", difficulty: "beginner", maxMembers: 10 });
      setShowCreateModal(false);
      fetchRooms();
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      await studyRoomService.joinRoom(roomId);
      setSelectedRoom(roomId);
      fetchMessages(roomId);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && selectedRoom) {
      try {
        await studyRoomService.sendMessage(selectedRoom, message);
        setMessage("");
        fetchMessages(selectedRoom);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const getMessageStyle = (messageType, sender) => {
    if (messageType === "ai") {
      return "bg-purple-100 border-l-4 border-purple-500 text-purple-800";
    }
    if (messageType === "system") {
      return "bg-gray-100 text-gray-700";
    }
    if (sender === user?.name) {
      return "bg-blue-600 text-white ml-auto";
    }
    return "bg-gray-200 text-gray-800";
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
            <span className="text-white font-bold text-sm">👥</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AI Study Rooms</h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Create Room
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Rooms */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Rooms</h2>
            <div className="space-y-3">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    selectedRoom === room._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedRoom(room._id);
                    fetchMessages(room._id);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{room.name}</h3>
                      <p className="text-sm text-gray-500">{room.members.length}/{room.maxMembers} members</p>
                      <p className="text-xs text-gray-400">{room.subject} • {room.difficulty}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinRoom(room._id);
                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-600 transition"
                    >
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                {selectedRoom ? rooms.find(r => r._id === selectedRoom)?.name : "Select a Room"}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedRoom ? "AI-powered study discussion" : "Choose a room to start chatting"}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {selectedRoom && messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.user?.name === user?.name ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        getMessageStyle(msg.messageType, msg.user?.name)
                      }`}
                    >
                      {msg.user && (
                        <p className="text-xs font-medium mb-1">{msg.user.name}</p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  {selectedRoom ? "No messages yet. Start the conversation!" : "Select a room to view messages"}
                </div>
              )}
            </div>

            {/* Message Input */}
            {selectedRoom && (
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
            )}
          </div>
        </div>
      </div>

      {/* AI Chat Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">🤖 AI Chat Summary</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Auto-generated every 10 messages</span>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <div className="text-gray-500 text-center py-8">
          AI summaries will appear here after 10 messages in any room.
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Study Room</h2>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Name</label>
                <input
                  type="text"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newRoom.description}
                  onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={newRoom.subject}
                    onChange={(e) => setNewRoom({ ...newRoom, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Subject</option>
                    <option value="GATE CS">GATE CS</option>
                    <option value="GATE EC">GATE EC</option>
                    <option value="GATE ME">GATE ME</option>
                    <option value="GATE CE">GATE CE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={newRoom.difficulty}
                    onChange={(e) => setNewRoom({ ...newRoom, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyRooms;