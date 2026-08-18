import { useEffect, useState, useCallback } from "react";
import { getHelpEntries, createHelpEntry, deleteHelpEntry } from "../services/studentHelpService";
import { HELP_CATEGORIES } from "../utils/constants";
import Loader from "../components/Loader";

export default function StudentHelpAdmin() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ category: "emergency", name: "", contactNumber: "", address: "", availableTime: "", description: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getHelpEntries();
      setEntries(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => fd.append(key, val));
      await createHelpEntry(fd);
      setForm({ category: "emergency", name: "", contactNumber: "", address: "", availableTime: "", description: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't add entry.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteHelpEntry(id);
    load();
  };

  return (
    <div>
      <h3 className="dash-title" style={{ fontSize: 16 }}>Add Student Help Entry</h3>
      <form className="dash-form" onSubmit={handleSubmit}>
        <div className="row2">
          <div className="field">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              {HELP_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div className="field"><label>Name</label><input name="name" required value={form.name} onChange={handleChange} /></div>
        </div>
        <div className="row2">
          <div className="field"><label>Contact Number</label><input name="contactNumber" required value={form.contactNumber} onChange={handleChange} /></div>
          <div className="field"><label>Available Time</label><input name="availableTime" value={form.availableTime} onChange={handleChange} /></div>
        </div>
        <div className="field"><label>Address</label><input name="address" required value={form.address} onChange={handleChange} /></div>
        <div className="field"><label>Description</label><input name="description" value={form.description} onChange={handleChange} /></div>
        {error && <p className="auth-error">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? "Adding…" : "Add Entry"}</button>
      </form>

      <h3 className="dash-title" style={{ fontSize: 16 }}>Existing Entries</h3>
      {loading ? <Loader label="Loading…" /> : (
        <div className="dash-list">
          {entries.length === 0 && <p className="empty-dash">No entries yet.</p>}
          {entries.map((e) => (
            <div className="dash-item" key={e._id}>
              <div className="dash-item-main">{e.name}<span className="sub">{e.category} · {e.contactNumber}</span></div>
              <button className="mini-btn delete" onClick={() => handleDelete(e._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
