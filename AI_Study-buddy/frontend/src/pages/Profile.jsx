import { useAuth } from "../contexts/AuthContext";

const fakeUser = {
  id: "U008",
  name: "Ritu Singh",
  email: "ritu.singh@example.com",
  phone: "9833445566",
  role: "Student",
  avatar: "",
};

const fakeDocuments = [
  {
    id: 1,
    title: "Algebra Notes",
    description: "Comprehensive notes on Algebra for GATE preparation.",
    createdAt: "2024-06-01",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: 2,
    title: "Electrical Circuits PDF",
    description: "Important circuit diagrams and solved problems.",
    createdAt: "2024-06-02",
    url: "https://www.orimi.com/pdf-test.pdf",
  },
  {
    id: 3,
    title: "CSE Algorithms Notes",
    description: "Handwritten notes on algorithms and data structures.",
    createdAt: "2024-06-03",
    url: "https://www.africau.edu/images/default/sample.pdf",
  },
  {
    id: 4,
    title: "AIDS ML Cheat Sheet",
    description: "Quick reference for Machine Learning concepts.",
    createdAt: "2024-06-04",
    url: "https://www.hq.nasa.gov/alsj/a17/A17_FlightPlan.pdf",
  },
];

const Profile = () => {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">My Profile</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center text-3xl font-bold text-purple-700">
            {fakeUser.avatar ? (
              <img
                src={fakeUser.avatar}
                alt={fakeUser.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              fakeUser.name.charAt(0)
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{fakeUser.name}</h2>
            <p className="text-purple-600">{fakeUser.role}</p>
            <p className="text-gray-600">{fakeUser.email}</p>
            <p className="text-gray-600">{fakeUser.phone}</p>
            <p className="text-xs text-gray-400">ID: {fakeUser.id}</p>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-purple-700 mb-4">My Documents</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {fakeDocuments.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col"
          >
            <h3 className="font-semibold text-lg mb-1">{doc.title}</h3>
            <p className="text-gray-600 mb-2">{doc.description}</p>
            <span className="text-xs text-gray-400 mb-3">
              {new Date(doc.createdAt).toLocaleDateString()}
            </span>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto bg-purple-700 text-white px-4 py-2 rounded text-center hover:bg-purple-800 transition"
              download
            >
              Download PDF
            </a>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-purple-700 underline text-sm text-center"
            >
              View Online
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
