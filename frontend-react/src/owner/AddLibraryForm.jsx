import { useState } from "react";
import { createLibrary } from "../services/libraryService";
import { useGeolocation } from "../hooks/useGeolocation";

export default function AddLibraryForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "", price: "", availableSeats: "", openingHours: "",
    facilities: "", contactNumber: "", address: ""
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

      await createLibrary(fd);
      setForm({ name: "", price: "", availableSeats: "", openingHours: "", facilities: "", contactNumber: "", address: "" });
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
      <div className="field"><label>Library Name</label><input name="name" required value={form.name} onChange={handleChange} /></div>
      <div className="row2">
        <div className="field"><label>Monthly Price (₹)</label><input name="price" type="number" required value={form.price} onChange={handleChange} /></div>
        <div className="field"><label>Available Seats</label><input name="availableSeats" type="number" required value={form.availableSeats} onChange={handleChange} /></div>
      </div>
      <div className="row2">
        <div className="field"><label>Opening Hours</label><input name="openingHours" placeholder="6am - 10pm" value={form.openingHours} onChange={handleChange} /></div>
        <div className="field"><label>Contact Number</label><input name="contactNumber" required value={form.contactNumber} onChange={handleChange} /></div>
      </div>
      <div className="field"><label>Facilities (comma separated)</label><input name="facilities" placeholder="AC, WiFi, Lockers" value={form.facilities} onChange={handleChange} /></div>
      <div className="field"><label>Full Address</label><input name="address" required value={form.address} onChange={handleChange} /></div>
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
