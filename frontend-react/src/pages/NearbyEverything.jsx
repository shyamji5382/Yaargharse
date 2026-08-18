import { useState } from "react";
import { getRooms } from "../services/roomService";
import { getMesses } from "../services/messService";
import { getVehicles } from "../services/vehicleService";
import { getLibraries } from "../services/libraryService";
import { getServices } from "../services/serviceService";
import { haversine, distLabel } from "../utils/distance";
import { photoUrl } from "../utils/constants";
import { useGeolocation } from "../hooks/useGeolocation";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const CATEGORY_META = {
  room: { label: "🏠 Room/PG", price: (i) => `₹${i.rent}/month` },
  mess: { label: "🍱 Mess", price: (i) => `₹${i.pricePerMeal}/meal` },
  vehicle: { label: "🛵 Vehicle", price: (i) => `₹${i.pricePerDay}/day` },
  library: { label: "📚 Library", price: (i) => `₹${i.price}/month` },
  service: { label: "🧺 Service", price: (i) => (i.price ? `₹${i.price}` : "") }
};

export default function NearbyEverything() {
  const [results, setResults] = useState(null);
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("idle");
  const { coords, status: geoStatus, error: geoError, locate } = useGeolocation();

  const handleFindNearby = async () => {
    if (!coords) { locate(); return; }
    setStatus("loading");
    try {
      const [rooms, messes, vehicles, libraries, services] = await Promise.all([
        getRooms(), getMesses(), getVehicles(), getLibraries(), getServices()
      ]);

      const tag = (arr, type) => (Array.isArray(arr) ? arr : []).map((i) => ({ ...i, _type: type }));

      const all = [
        ...tag(rooms, "room"),
        ...tag(messes, "mess"),
        ...tag(vehicles, "vehicle"),
        ...tag(libraries, "library"),
        ...tag(services, "service")
      ]
        .filter((i) => typeof i.lat === "number" && typeof i.lng === "number")
        .map((i) => ({ ...i, dist: haversine(coords.lat, coords.lng, i.lat, i.lng) }))
        .sort((a, b) => a.dist - b.dist);

      setResults(all);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const visible = results ? results.filter((r) => category === "all" || r._type === category) : [];

  return (
    <div className="page">
      <div className="sign-tag">📍 Nearby Everything</div>
      <h2 className="display" style={{ marginBottom: 16 }}>What's Around You</h2>

      <div className="page-controls" style={{ marginBottom: 20 }}>
        <button className="btn btn-primary" onClick={handleFindNearby} disabled={geoStatus === "locating" || status === "loading"}>
          {geoStatus === "locating" || status === "loading" ? "Finding…" : "📍 Find What's Nearby"}
        </button>
        {results && (
          <select className="search-input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <option key={key} value={key}>{meta.label}</option>
            ))}
          </select>
        )}
      </div>

      {geoError && <p className="auth-error">{geoError}</p>}
      {status === "loading" && <Loader label="Finding everything nearby…" />}

      {status === "success" && visible.length === 0 && <EmptyState title="Nothing found nearby" />}

      {status === "success" && visible.length > 0 && (
        <div className="dash-list" style={{ maxWidth: 640 }}>
          {visible.map((item) => {
            const meta = CATEGORY_META[item._type];
            const name = item.name || `${item.brand || ""} ${item.model || ""}`.trim() || item.itemName;
            const cover = item.photos?.[0];
            return (
              <div className="dash-item" key={`${item._type}-${item._id}`}>
                {cover && <img src={photoUrl(cover)} alt={name} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }} />}
                <div className="dash-item-main" style={{ flex: 1 }}>
                  {name}
                  <span className="sub">
                    {meta.label} · {distLabel(item.dist)} {meta.price(item) && `· ${meta.price(item)}`}
                    {item.verified && " · ✓ Verified"}
                  </span>
                </div>
                {item.contactNumber && (
                  <a className="mini-btn approve" href={`tel:${item.contactNumber}`}>📞 Call</a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
