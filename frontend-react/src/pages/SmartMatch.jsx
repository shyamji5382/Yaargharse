import { useState } from "react";
import { getRooms } from "../services/roomService";
import { getMesses } from "../services/messService";
import { computeMatches } from "../utils/smartMatch";
import { useGeolocation } from "../hooks/useGeolocation";
import MatchCard from "../components/MatchCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

export default function SmartMatch() {
  const [form, setForm] = useState({
    college: "",
    budget: "",
    maxDistance: "3",
    roomType: "any",
    foodPreference: "any",
    messRequired: "no"
  });
  const [matches, setMatches] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  const { coords, status: geoStatus, error: geoError, locate } = useGeolocation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!coords) {
      setError("Click \"Use my current location\" first — we need it to calculate distance to rooms.");
      return;
    }

    setStatus("loading");
    try {
      const [rooms, messes] = await Promise.all([getRooms(), getMesses()]);

      const results = computeMatches({
        rooms: Array.isArray(rooms) ? rooms : [],
        messes: Array.isArray(messes) ? messes : [],
        budget: Number(form.budget) || 0,
        maxDistance: Number(form.maxDistance) || 3,
        roomType: form.roomType,
        foodPreference: form.foodPreference,
        messRequired: form.messRequired === "yes",
        coords
      });

      setMatches(results);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="page">
      <div className="sign-tag">🤖 Find My Perfect Room</div>
      <h2 className="display" style={{ marginBottom: 6 }}>Smart Room Match</h2>
      <p className="hero-text" style={{ margin: "0 0 26px", textAlign: "left", maxWidth: 560 }}>
        Rule-based matching over real, approved listings — not generative AI, and never a made-up result.
        We use your current location to calculate real distances.
      </p>

      <form className="dash-form" onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
        <div className="field">
          <label>College / University (for your reference)</label>
          <input name="college" placeholder="GLA University" value={form.college} onChange={handleChange} />
        </div>

        <div className="row2">
          <div className="field">
            <label>Monthly Budget (₹)</label>
            <input name="budget" type="number" required placeholder="6000" value={form.budget} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Max Distance (km)</label>
            <input name="maxDistance" type="number" step="0.5" required value={form.maxDistance} onChange={handleChange} />
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label>Room Type</label>
            <select name="roomType" value={form.roomType} onChange={handleChange}>
              <option value="any">Any</option>
              <option value="single">Single</option>
              <option value="shared">Shared</option>
            </select>
          </div>
          <div className="field">
            <label>Food Preference</label>
            <select name="foodPreference" value={form.foodPreference} onChange={handleChange}>
              <option value="any">Any</option>
              <option value="veg">Veg</option>
              <option value="nonveg">Non-veg</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label>Mess Required Nearby?</label>
          <select name="messRequired" value={form.messRequired} onChange={handleChange}>
            <option value="no">Not necessary</option>
            <option value="yes">Yes, required</option>
          </select>
        </div>

        <div className="field">
          <label>Your Location</label>
          <button type="button" className="btn btn-outline" onClick={locate} disabled={geoStatus === "locating"}>
            {geoStatus === "locating" ? "Locating…" : coords ? "📍 Location captured" : "📍 Use my current location"}
          </button>
          {geoError && <p className="auth-error">{geoError}</p>}
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Matching…" : "Find My Matches"}
        </button>
      </form>

      <div style={{ marginTop: 34 }}>
        {status === "loading" && <Loader label="Finding your best matches…" />}
        {status === "error" && <ErrorMessage message="Couldn't load listings for matching." />}
        {status === "success" && matches.length === 0 && (
          <EmptyState
            title="No matches found"
            message="Try increasing your budget, distance, or relaxing the mess requirement."
          />
        )}
        {status === "success" && matches.length > 0 && (
          <>
            <h3 className="dash-title" style={{ fontSize: 16 }}>Top {matches.length} Matches</h3>
            <div className="grid">
              {matches.map((r) => (
                <MatchCard key={r._id} room={r} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
