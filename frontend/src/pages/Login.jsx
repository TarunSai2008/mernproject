import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { setCustomer } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setSaving(true);

    try {
      const response = await api.post("/customers/login", form);
      setCustomer(response.data.customer);
      navigate("/home");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleFillDemo = () => {
    setForm({ email: "john@gmail.com", password: "john123" });
  };

  return (
    <main className="auth-page">
      <div className="auth-bg-ambient"></div>

      <section className="auth-box">
        <div className="auth-brand-logo">
          <span className="brand-icon-lg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </span>
          <h2>Shop<span className="brand-highlight">Kart</span></h2>
        </div>

        <div className="auth-head">
          <h1>Welcome Back</h1>
          <p>Login to access your saved items, cart, and account settings.</p>
        </div>

        {error && (
          <div className="error-alert">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="input-group">
            <span className="input-label-text">Email Address</span>
            <div className="input-with-icon">
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. john@gmail.com"
              />
            </div>
          </label>

          <label className="input-group">
            <span className="input-label-text">Password</span>
            <div className="input-with-icon">
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <div className="demo-credentials-chip" onClick={handleFillDemo}>
            💡 Quick Demo: Click to auto-fill (john@gmail.com)
          </div>

          <button className="main-button auth-submit-btn" disabled={saving}>
            {saving ? (
              <span className="btn-loading-flex">
                <span className="spinner-sm"></span> Logging in...
              </span>
            ) : (
              <span>Login to Account</span>
            )}
          </button>
        </form>

        <p className="switch-text">
          New to ShopKart? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
