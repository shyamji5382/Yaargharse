import { useState } from "react";
import { createService } from "../services/serviceService";
import { useGeolocation } from "../hooks/useGeolocation";
import { SERVICE_CATEGORIES } from "../utils/constants";

export default function AddServiceForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "", category: "laundry", price: "", availableTime: "", contactNumber: "", address: "", description: ""
  });
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { coords, status: geoStatus, error: geoError, locate } = useGeolocation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhotos = (e) => setPhotos(Array.from(e.target.files || []));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!coords) { setError("Click \"Use my current location\" first."); return; }
    if (photos.length === 0) { setError("Please add at least 1 photo."); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => fd.append(key, val));
      fd.append("lat", coords.lat);
      fd.append("lng", coords.lng);
      photos.forEach((file) => fd.append("photos", file));

      await createService(fd);
      setForm({ name: "", category: "laundry", price: "", availableTime: "", contactNumber: "", address: "", description: "" });
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
      <div className="row2">
        <div className="field"><label>Service/Shop Name</label><input name="name" required value={form.name} onChange={handleChange} /></div>
        <div className="field">
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            {SERVICE_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>
      </div>
      <div className="row2">
        <div className="field"><label>Price (₹, optional)</label><input name="price" type="number" value={form.price} onChange={handleChange} /></div>
        <div className="field"><label>Available Time</label><input name="availableTime" placeholder="9am - 8pm" value={form.availableTime} onChange={handleChange} /></div>
      </div>
      <div className="field"><label>Contact Number</label><input name="contactNumber" required value={form.contactNumber} onChange={handleChange} /></div>
      <div className="field"><label>Full Address</label><input name="address" required value={form.address} onChange={handleChange} /></div>
      <div className="field"><label>Description</label><input name="description" value={form.description} onChange={handleChange} /></div>
      <div className="field">
        <label>Location</label>
        <button type="button" className="btn btn-outline" onClick={locate} disabled={geoStatus === "locating"}>
          {geoStatus === "locating" ? "Locating…" : coords ? "📍 Location captured" : "📍 Use my current location"}
        </button>
        {geoError && <p className="auth-error">{geoError}</p>}
      </div>
      <div className="field">
        <label>Photos (at least 1)</label>
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handlePhotos} />
        {photos.length > 0 && (
          <div className="photo-preview-row">
            {photos.map((file, i) => <img key={i} src={URL.createObjectURL(file)} alt={`preview ${i + 1}`} className="photo-thumb" />)}
          </div>
        )}
      </div>
      {error && <p className="auth-error">{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Submitting…" : "Submit for Review"}</button>
    </form>
  );
}
