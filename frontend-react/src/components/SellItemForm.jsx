import { useState } from "react";
import { createItem } from "../services/buySellService";
import { ITEM_CATEGORIES, ITEM_CONDITIONS } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";

export default function SellItemForm({ onCreated }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    itemName: "", category: "books", price: "", condition: "good",
    address: "", description: "", showContact: false, contactNumber: user?.phone || ""
  });
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };
  const handlePhotos = (e) => setPhotos(Array.from(e.target.files || []));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (photos.length === 0) {
      setError("Please add at least 1 photo.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => fd.append(key, val));
      photos.forEach((file) => fd.append("photos", file));

      await createItem(fd);

      setForm({ itemName: "", category: "books", price: "", condition: "good", address: "", description: "", showContact: false, contactNumber: user?.phone || "" });
      setPhotos([]);
      onCreated?.();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't submit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="dash-form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Item Name</label>
        <input name="itemName" required value={form.itemName} onChange={handleChange} />
      </div>

      <div className="row2">
        <div className="field">
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            {ITEM_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Condition</label>
          <select name="condition" value={form.condition} onChange={handleChange}>
            {ITEM_CONDITIONS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>
      </div>

      <div className="field">
        <label>Price (₹)</label>
        <input name="price" type="number" required value={form.price} onChange={handleChange} />
      </div>

      <div className="field">
        <label>Location</label>
        <input name="address" required placeholder="Area, city" value={form.address} onChange={handleChange} />
      </div>

      <div className="field">
        <label>Description</label>
        <input name="description" placeholder="Condition details, reason for selling…" value={form.description} onChange={handleChange} />
      </div>

      <div className="field">
        <label className="checkbox-label">
          <input type="checkbox" name="showContact" checked={form.showContact} onChange={handleChange} />
          Share my phone number with buyers
        </label>
        {form.showContact && (
          <input name="contactNumber" placeholder="Your phone number" value={form.contactNumber} onChange={handleChange} style={{ marginTop: 8 }} />
        )}
      </div>

      <div className="field">
        <label>Photos (at least 1)</label>
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handlePhotos} />
        {photos.length > 0 && (
          <div className="photo-preview-row">
            {photos.map((file, i) => (
              <img key={i} src={URL.createObjectURL(file)} alt={`preview ${i + 1}`} className="photo-thumb" />
            ))}
          </div>
        )}
      </div>

      {error && <p className="auth-error">{error}</p>}

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Submitting…" : "Submit for Review"}
      </button>
    </form>
  );
}
