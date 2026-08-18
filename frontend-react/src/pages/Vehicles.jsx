import { useEffect, useMemo, useState } from "react";
import { getVehicles } from "../services/vehicleService";
import { VEHICLE_TYPES } from "../utils/constants";
import VehicleCard from "../components/VehicleCard";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [status, setStatus] = useState("loading");

  const load = async () => {
    setStatus("loading");
    try {
      const data = await getVehicles();
      setVehicles(Array.isArray(data) ? data : []);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => { load(); }, []);

  const visible = useMemo(() => {
    return vehicles
      .filter((v) => typeFilter === "all" || v.type === typeFilter)
      .filter((v) =>
        `${v.brand} ${v.model}`.toLowerCase().includes(query.toLowerCase())
      );
  }, [vehicles, query, typeFilter]);

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="display">Vehicle Rentals</h2>
        <div className="page-controls">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by brand or model…" />
          <select className="search-input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            {VEHICLE_TYPES.map((t) => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {status === "loading" && <Loader label="Loading vehicles…" />}
      {status === "error" && <ErrorMessage message="Couldn't load vehicles." onRetry={load} />}
      {status === "success" && visible.length === 0 && (
        <EmptyState title="No vehicles found" message="Try a different search or check back later." />
      )}

      {status === "success" && visible.length > 0 && (
        <div className="grid">
          {visible.map((v) => <VehicleCard key={v._id} vehicle={v} />)}
        </div>
      )}
    </div>
  );
}
