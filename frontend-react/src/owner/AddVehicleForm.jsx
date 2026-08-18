import { useState } from "react";
import { createVehicle } from "../services/vehicleService";
import { useGeolocation } from "../hooks/useGeolocation";
import { VEHICLE_TYPES } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";

export default function AddVehicleForm({ onCreated }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    type: "scooty", brand: "", model: "", pricePerDay: "",
    securityDeposit: "", details: "", address: "", contactNumber: user?.phone || ""
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

    if (!coords) {
      setError("Click \"Use my current location\" first.");
      return;
    }
    if (photos.length === 0) {
      setError("Please add at least 1 photo.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => fd.append(key, val));
      fd.append("lat", coords.lat);
      fd.append("lng", coords.lng);
      photos.forEach((file) => fd.append("photos", file));

      await createVehicle(fd);

      setForm({ type: "scooty", brand: "", model: "", pricePerDay: "", securityDeposit: "", details: "", address: "", contactNumber: user?.phone || "" });
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
        <div className="field">
          <label>Vehicle Type</label>
          <select name="type" value={form.type} onChange={handleChange}>
            {VEHICLE_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Contact Number</label>
          <input name="contactNumber" required value={form.contactNumber} onChange={handleChange} />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label>Brand</label>
          <input name="brand" required placeholder="Honda, TVS, Tata…" value={form.brand} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Model</label>
          <input name="model" required placeholder="Activa, Jupiter…" value={form.model} onChange={handleChange} />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label>Price per day (₹)</label>
          <input name="pricePerDay" type="number" required value={form.pricePerDay} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Security Deposit (₹)</label>
          <input name="securityDeposit" type="number" value={form.securityDeposit} onChange={handleChange} />
        </div>
      </div>

      <div className="field">
        <label>Details</label>
        <input name="details" placeholder="Fuel type, mileage, condition…" value={form.details} onChange={handleChange} />
      </div>

      <div className="field">
        <label>Full Address</label>
        <input name="address" required placeholder="Where can this be picked up?" value={form.address} onChange={handleChange} />
      </div>

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
