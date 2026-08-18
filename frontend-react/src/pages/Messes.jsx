import { useEffect, useMemo, useState } from "react";
import { getMesses } from "../services/messService";
import { haversine } from "../utils/distance";
import { useGeolocation } from "../hooks/useGeolocation";
import MessCard from "../components/MessCard";
import SearchBar from "../components/SearchBar";
import LocateButton from "../components/LocateButton";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

export default function Messes() {
  const [messes, setMesses] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("loading"); // loading | success | error
  const { coords, status: geoStatus, error: geoError, locate } = useGeolocation();

  const load = async () => {
    setStatus("loading");
    try {
      const data = await getMesses();
      setMesses(Array.isArray(data) ? data : []);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => { load(); }, []);

  const visibleMesses = useMemo(() => {
    let list = messes.filter((m) =>
      m.name?.toLowerCase().includes(query.toLowerCase()) ||
      m.cuisine?.some((c) => c.toLowerCase().includes(query.toLowerCase()))
    );

    if (coords) {
      list = list
        .map((m) => ({ ...m, dist: haversine(coords.lat, coords.lng, m.lat, m.lng) }))
        .sort((a, b) => a.dist - b.dist);
    }

    return list;
  }, [messes, query, coords]);

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="display">Mess Listings</h2>
        <div className="page-controls">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by name or cuisine…" />
          <LocateButton status={geoStatus} onClick={locate} />
        </div>
      </div>

      {geoError && <p className="auth-error">{geoError}</p>}

      {status === "loading" && <Loader label="Loading messes…" />}
      {status === "error" && <ErrorMessage message="Couldn't load messes." onRetry={load} />}
      {status === "success" && visibleMesses.length === 0 && (
        <EmptyState title="No messes found" message="Try a different search, or check back later." />
      )}

      {status === "success" && visibleMesses.length > 0 && (
        <div className="grid">
          {visibleMesses.map((m) => (
            <MessCard key={m._id} mess={m} />
          ))}
        </div>
      )}
    </div>
  );
}
