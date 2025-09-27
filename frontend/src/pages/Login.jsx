import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
      padding: "1rem"
    }}>
      <form
        className="login-form"
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(33,150,243,0.08)",
          width: "100%",
          maxWidth: "400px",
          border: "1px solid #bbdefb"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <div style={{ width: "40px", height: "40px", background: "#1976d2", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: "bold", fontSize: "1.25rem" }}>📚</span>
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1976d2" }}>GATE Study Buddy</h1>
          </div>
          <p style={{ fontSize: "0.95rem", color: "#607d8b" }}>Your AI-powered study companion</p>
        </div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem", textAlign: "center", color: "#1976d2" }}>
          Login
        </h2>
        {error && (
          <div style={{ background: "#ffcdd2", color: "#d32f2f", borderRadius: "8px", padding: "0.75rem", textAlign: "center", marginBottom: "1rem" }}>
            {error}
          </div>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            border: "1px solid #90caf9",
            borderRadius: "8px",
            marginBottom: "1rem",
            background: "#f5faff",
            color: "#1a1a1a",
            fontSize: "1rem"
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            border: "1px solid #90caf9",
            borderRadius: "8px",
            marginBottom: "1rem",
            background: "#f5faff",
            color: "#1a1a1a",
            fontSize: "1rem"
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "8px",
            background: loading ? "#90caf9" : "#1976d2",
            color: "#fff",
            fontWeight: 600,
            border: "none",
            marginTop: "0.5rem",
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div style={{ textAlign: "center", fontSize: "0.95rem", color: "#607d8b", marginTop: "1rem" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#1976d2", textDecoration: "underline" }}>
            Create it
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
