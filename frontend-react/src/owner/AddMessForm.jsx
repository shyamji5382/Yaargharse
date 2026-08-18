import { useState } from "react";
import { createMess } from "../services/messService";
import { useGeolocation } from "../hooks/useGeolocation";
import { DAYS, MEALS } from "../utils/constants";

const emptyMenu = () =>
  DAYS.reduce((acc, d) => {
    acc[d.key] = { breakfast: "", lunch: "", dinner: "" };
    return acc;
  }, {});

export default function AddMessForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "", type: "veg", timing: "", cuisine: "",
    pricePerMeal: "", priceMonthly: "", address: ""
  });
  const [menu, setMenu] = useState(emptyMenu());
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { coords, status: geoStatus, error: geoError, locate } = useGeolocation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleMenuChange = (day, meal, value) => {
    setMenu((m) => ({ ...m, [day]: { ...m[day], [meal]: value } }));
  };

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
    if (photos.length === 0) {
      setError("Please add at least 1 photo of your mess.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("type", form.type);
      fd.append("timing", form.timing);
      fd.append("cuisine", form.cuisine);
      fd.append("pricePerMeal", form.pricePerMeal);
      fd.append("priceMonthly", form.priceMonthly);
      fd.append("address", form.address);
      fd.append("lat", coords.lat);
      fd.append("lng", coords.lng);
      fd.append("weeklyMenu", JSON.stringify(menu));
      photos.forEach((file) => fd.append("photos", file));

      await createMess(fd);

      setForm({ name: "", type: "veg", timing: "", cuisine: "", pricePerMeal: "", priceMonthly: "", address: "" });
      setMenu(emptyMenu());
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
        <label>Mess Name</label>
        <input name="name" required value={form.name} onChange={handleChange} />
      </div>

      <div className="row2">
        <div className="field">
          <label>Type</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="veg">Veg</option>
            <option value="nonveg">Non-veg</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div className="field">
          <label>General Timing</label>
          <input name="timing" placeholder="12–2pm, 7:30–9:30pm" value={form.timing} onChange={handleChange} />
        </div>
      </div>

      <div className="field">
        <label>Cuisine (comma separated)</label>
        <input name="cuisine" placeholder="North Indian, Thali" value={form.cuisine} onChange={handleChange} />
      </div>

      <div className="row2">
        <div className="field">
          <label>Price per meal (₹)</label>
          <input name="pricePerMeal" type="number" required value={form.pricePerMeal} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Monthly plan (₹)</label>
          <input name="priceMonthly" type="number" required value={form.priceMonthly} onChange={handleChange} />
        </div>
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
        <label>Weekly Menu</label>
        <div className="menu-table-wrap">
          <table className="menu-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
              </tr>
            </thead>
            <tbody>
              {DAYS.map((d) => (
                <tr key={d.key}>
                  <td className="menu-day">{d.label}</td>
                  {MEALS.map((meal) => (
                    <td key={meal}>
                      <input
                        type="text"
                        placeholder={meal}
                        value={menu[d.key][meal]}
                        onChange={(e) => handleMenuChange(d.key, meal, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
