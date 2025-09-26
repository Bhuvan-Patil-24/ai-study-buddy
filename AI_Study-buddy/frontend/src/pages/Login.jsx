import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/dashboard"); // Simple redirect, no reload
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-purple-400">
      <form
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-purple-700 text-center">
          Login
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 rounded p-2 text-center">
            {error}
          </div>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-purple-700 text-white rounded py-2 font-semibold hover:bg-purple-800 transition"
        >
          Login
        </button>
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-700 underline">
            Create it
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
