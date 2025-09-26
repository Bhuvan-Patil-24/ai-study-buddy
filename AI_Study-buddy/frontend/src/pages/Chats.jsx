import { useState, useRef, useEffect } from "react";

const fakeRooms = [
  {
    id: "electrical",
    name: "Electrical GATE",
    description: "Discuss all things Electrical Engineering for GATE.",
    messages: [
      {
        id: 1,
        sender: "Priya",
        content: "Anyone has notes for circuits?",
        time: "09:00",
      },
      {
        id: 2,
        sender: "Rahul",
        content: "Check the files section!",
        time: "09:01",
      },
      {
        id: 3,
        sender: "Ankit",
        content: "Let's have a mock test this weekend.",
        time: "09:05",
      },
    ],
    users: ["Priya", "Rahul", "Ankit", "Megha"],
  },
  {
    id: "cse",
    name: "CSE GATE",
    description: "Computer Science GATE group chat.",
    messages: [
      {
        id: 1,
        sender: "Amit",
        content: "What is the best book for algorithms?",
        time: "10:00",
      },
      {
        id: 2,
        sender: "Sneha",
        content: "CLRS is the gold standard!",
        time: "10:01",
      },
      {
        id: 3,
        sender: "Vikas",
        content: "Anyone up for a coding session?",
        time: "10:10",
      },
    ],
    users: ["Amit", "Sneha", "Vikas", "Ritu"],
  },
  {
    id: "aids",
    name: "AIDS GATE",
    description: "Artificial Intelligence & Data Science GATE group.",
    messages: [
      {
        id: 1,
        sender: "Sara",
        content: "Share ML notes please.",
        time: "11:00",
      },
      {
        id: 2,
        sender: "Rohan",
        content: "Uploading in a minute!",
        time: "11:01",
      },
      {
        id: 3,
        sender: "Divya",
        content: "Let's discuss last year's paper.",
        time: "11:05",
      },
    ],
    users: ["Sara", "Rohan", "Divya", "Manoj"],
  },
];

const Chats = () => {
  const [rooms] = useState(fakeRooms);
  const [selectedRoom, setSelectedRoom] = useState(fakeRooms[0]);
  const [messages, setMessages] = useState(selectedRoom.messages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Update messages when room changes
  useEffect(() => {
    setMessages(selectedRoom.messages);
  }, [selectedRoom]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now(),
      sender: "You",
      content: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  return (
    <div className="flex h-[80vh] bg-white rounded shadow overflow-hidden">
      {/* Sidebar: Chat Rooms */}
      <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-purple-700">Group Chats</h2>
        <ul>
          {rooms.map((room) => (
            <li
              key={room.id}
              className={`p-2 rounded cursor-pointer mb-2 ${
                selectedRoom.id === room.id
                  ? "bg-purple-100 font-semibold"
                  : "hover:bg-purple-50"
              }`}
              onClick={() => setSelectedRoom(room)}
            >
              {room.name}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Members</h3>
          <ul>
            {selectedRoom.users.map((user) => (
              <li key={user} className="text-gray-700 mb-1">
                {user}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b px-6 py-4 bg-purple-50">
          <h3 className="font-bold text-purple-700 text-xl">
            {selectedRoom.name}
          </h3>
          <div className="text-sm text-gray-500">
            {selectedRoom.description}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 bg-white">
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col">
              <span className="text-xs text-gray-500">
                {msg.sender}{" "}
                <span className="ml-2 text-gray-400">{msg.time}</span>
              </span>
              <span className="bg-purple-100 rounded px-3 py-1 inline-block max-w-xl">
                {msg.content}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="flex p-4 border-t bg-gray-50">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 mr-2 focus:outline-none"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chats;
