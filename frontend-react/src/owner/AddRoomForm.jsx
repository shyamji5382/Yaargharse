import { useState } from "react";
import { createRoom } from "../services/roomService";
import { useGeolocation } from "../hooks/useGeolocation";

const MIN_PHOTOS = 3;

export default function AddRoomForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "", gender: "boys", roomType: "single",
    rent: "", deposit: "", facilities: "", address: ""
  });
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { coords, status: geoStatus, error: geoError, locate } = useGeolocation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotos = (e) => {
    setPhotos(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!coords) {
      setError("Click \"Use my current location\" so students can find you on the map.");
      return;
    }
    if (photos.length < MIN_PHOTOS) {
      setError(`Please add at least ${MIN_PHOTOS} photos of the room.`);
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("gender", form.gender);
      fd.append("roomType", form.roomType);
      fd.append("rent", form.rent);
      fd.append("deposit", form.deposit);
      fd.append("facilities", form.facilities);
      fd.append("address", form.address);
      fd.append("lat", coords.lat);
      fd.append("lng", coords.lng);
      photos.forEach((file) => fd.append("photos", file));

      await createRoom(fd);

      setForm({ name: "", gender: "boys", roomType: "single", rent: "", deposit: "", facilities: "", address: "" });
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
        <label>Property Name</label>
        <input name="name" required value={form.name} onChange={handleChange} />
      </div>

      <div className="row2">
        <div className="field">
          <label>For</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
            <option value="coed">Co-ed</option>
          </select>
        </div>
        <div className="field">
          <label>Room Type</label>
          <select name="roomType" value={form.roomType} onChange={handleChange}>
            <option value="single">Single</option>
            <option value="shared">Shared</option>
          </select>
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label>Rent / month (₹)</label>
          <input name="rent" type="number" required value={form.rent} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Deposit (₹)</label>
          <input name="deposit" type="number" value={form.deposit} onChange={handleChange} />
        </div>
      </div>

      <div className="field">
        <label>Facilities (comma separated)</label>
        <input name="facilities" placeholder="WiFi, AC, Attached Bath" value={form.facilities} onChange={handleChange} />
      </div>

      <div className="field">
        <label>Full Address</label>
        <input name="address" required placeholder="House no., street, area, city" value={form.address} onChange={handleChange} />
      </div>

      <div className="field">
        <label>Location</label>
        <button type="button" className="btn btn-outline" onClick={locate} disabled={geoStatus === "locating"}>
          {geoStatus === "locating" ? "Locating…" : coords ? "📍 Location captured" : "📍 Use my current location"}
        </button>
        {geoError && <p className="auth-error">{geoError}</p>}
      </div>

      <div className="field">
        <label>Photos (minimum {MIN_PHOTOS})</label>
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handlePhotos} />
        <p className="field-hint">{photos.length} photo{photos.length !== 1 ? "s" : ""} selected</p>
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
