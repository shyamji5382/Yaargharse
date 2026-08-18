import { useEffect, useMemo, useState } from "react";
import { getLibraries } from "../services/libraryService";
import { haversine } from "../utils/distance";
import { useGeolocation } from "../hooks/useGeolocation";
import LibraryCard from "../components/LibraryCard";
import SearchBar from "../components/SearchBar";
import LocateButton from "../components/LocateButton";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

export default function Libraries() {
  const [libraries, setLibraries] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("loading");
  const { coords, status: geoStatus, error: geoError, locate } = useGeolocation();

  const load = async () => {
    setStatus("loading");
    try {
      const data = await getLibraries();
      setLibraries(Array.isArray(data) ? data : []);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => { load(); }, []);

  const visible = useMemo(() => {
    let list = libraries.filter((l) => l.name?.toLowerCase().includes(query.toLowerCase()));
    if (coords) {
      list = list.map((l) => ({ ...l, dist: haversine(coords.lat, coords.lng, l.lat, l.lng) })).sort((a, b) => a.dist - b.dist);
    }
    return list;
  }, [libraries, query, coords]);

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="display">Libraries</h2>
        <div className="page-controls">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by name…" />
          <LocateButton status={geoStatus} onClick={locate} />
        </div>
      </div>
      {geoError && <p className="auth-error">{geoError}</p>}
      {status === "loading" && <Loader label="Loading libraries…" />}
      {status === "error" && <ErrorMessage message="Couldn't load libraries." onRetry={load} />}
      {status === "success" && visible.length === 0 && <EmptyState title="No libraries found" />}
      {status === "success" && visible.length > 0 && (
        <div className="grid">{visible.map((l) => <LibraryCard key={l._id} library={l} />)}</div>
      )}
    </div>
  );
}
