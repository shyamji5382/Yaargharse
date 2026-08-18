import { useEffect, useMemo, useState } from "react";
import { getRooms } from "../services/roomService";
import { haversine } from "../utils/distance";
import { useGeolocation } from "../hooks/useGeolocation";
import RoomCard from "../components/RoomCard";
import SearchBar from "../components/SearchBar";
import LocateButton from "../components/LocateButton";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("loading");
  const { coords, status: geoStatus, error: geoError, locate } = useGeolocation();

  const load = async () => {
    setStatus("loading");
    try {
      const data = await getRooms();
      setRooms(Array.isArray(data) ? data : []);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => { load(); }, []);

  const visibleRooms = useMemo(() => {
    let list = rooms.filter((r) => r.name?.toLowerCase().includes(query.toLowerCase()));

    if (coords) {
      list = list
        .map((r) => ({ ...r, dist: haversine(coords.lat, coords.lng, r.lat, r.lng) }))
        .sort((a, b) => a.dist - b.dist);
    }

    return list;
  }, [rooms, query, coords]);

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="display">Room / PG Listings</h2>
        <div className="page-controls">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by name…" />
          <LocateButton status={geoStatus} onClick={locate} />
        </div>
      </div>

      {geoError && <p className="auth-error">{geoError}</p>}

      {status === "loading" && <Loader label="Loading rooms…" />}
      {status === "error" && <ErrorMessage message="Couldn't load rooms." onRetry={load} />}
      {status === "success" && visibleRooms.length === 0 && (
        <EmptyState title="No rooms found" message="Try a different search, or check back later." />
      )}

      {status === "success" && visibleRooms.length > 0 && (
        <div className="grid">
          {visibleRooms.map((r) => (
            <RoomCard key={r._id} room={r} />
          ))}
        </div>
      )}
    </div>
  );
}
