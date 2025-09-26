import { useState } from "react";

const fakeUsers = [
  {
    id: "U001",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "9876543210",
    role: "Student",
    avatar: "",
  },
  {
    id: "U002",
    name: "Rahul Verma",
    email: "rahul.verma@example.com",
    phone: "9123456780",
    role: "Student",
    avatar: "",
  },
  {
    id: "U003",
    name: "Ankit Singh",
    email: "ankit.singh@example.com",
    phone: "9988776655",
    role: "Student",
    avatar: "",
  },
  {
    id: "U004",
    name: "Megha Patel",
    email: "megha.patel@example.com",
    phone: "9001122334",
    role: "Student",
    avatar: "",
  },
  {
    id: "U005",
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    phone: "9876001234",
    role: "Mentor",
    avatar: "",
  },
  {
    id: "U006",
    name: "Sneha Joshi",
    email: "sneha.joshi@example.com",
    phone: "9812345678",
    role: "Mentor",
    avatar: "",
  },
  {
    id: "U007",
    name: "Vikas Gupta",
    email: "vikas.gupta@example.com",
    phone: "9822334455",
    role: "Student",
    avatar: "",
  },
  {
    id: "U008",
    name: "Ritu Singh",
    email: "ritu.singh@example.com",
    phone: "9833445566",
    role: "Student",
    avatar: "",
  },
  {
    id: "U009",
    name: "Sara Khan",
    email: "sara.khan@example.com",
    phone: "9844556677",
    role: "Mentor",
    avatar: "",
  },
  {
    id: "U010",
    name: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    phone: "9855667788",
    role: "Student",
    avatar: "",
  },
];

const Team = () => {
  const [filter, setFilter] = useState("all");

  const filteredTeam = fakeUsers.filter((member) => {
    if (filter === "all") return true;
    return member.role.toLowerCase() === filter;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-purple-700 mb-4">User Team</h1>

      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            filter === "all"
              ? "bg-purple-700 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "student"
              ? "bg-purple-700 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setFilter("student")}
        >
          Students
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "mentor"
              ? "bg-purple-700 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setFilter("mentor")}
        >
          Mentors
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeam.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-lg shadow p-6 flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center text-3xl font-bold text-purple-700 mb-2">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                member.name.charAt(0)
              )}
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-purple-600">{member.role}</p>
              <p className="text-gray-500">{member.email}</p>
              <p className="text-gray-500">{member.phone}</p>
              <p className="text-xs text-gray-400">ID: {member.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
