import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../utils/constants";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: ROLES.STUDENT
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <form className="auth-form-card" onSubmit={handleSubmit}>
        <h2 className="display">Register</h2>

        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" required value={form.name} onChange={handleChange} />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
        </div>

        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required minLength={6} value={form.password} onChange={handleChange} />
        </div>

        <div className="field">
          <label htmlFor="role">I am a</label>
          <select id="role" name="role" value={form.role} onChange={handleChange}>
            <option value={ROLES.STUDENT}>Student (looking for mess/room)</option>
            <option value={ROLES.MESS_OWNER}>Mess Owner (list my mess)</option>
            <option value={ROLES.ROOM_OWNER}>Room/PG Owner (list my room)</option>
            <option value={ROLES.VEHICLE_OWNER}>Vehicle Owner (list my vehicle for rent)</option>
            <option value={ROLES.LIBRARY_OWNER}>Library Owner (list my library)</option>
            <option value={ROLES.SERVICE_PROVIDER}>Service Provider (laundry, printing, etc.)</option>
          </select>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create Account"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
