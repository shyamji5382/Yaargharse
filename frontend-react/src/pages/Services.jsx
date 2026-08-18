import { useEffect, useMemo, useState } from "react";
import { getServices } from "../services/serviceService";
import { haversine } from "../utils/distance";
import { useGeolocation } from "../hooks/useGeolocation";
import { SERVICE_CATEGORIES } from "../utils/constants";
import ServiceCard from "../components/ServiceCard";
import SearchBar from "../components/SearchBar";
import LocateButton from "../components/LocateButton";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

export default function Services() {
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("loading");
  const { coords, status: geoStatus, error: geoError, locate } = useGeolocation();

  const load = async () => {
    setStatus("loading");
    try {
      const data = await getServices();
      setServices(Array.isArray(data) ? data : []);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => { load(); }, []);

  const visible = useMemo(() => {
    let list = services
      .filter((s) => category === "all" || s.category === category)
      .filter((s) => s.name?.toLowerCase().includes(query.toLowerCase()));
    if (coords) {
      list = list.map((s) => ({ ...s, dist: haversine(coords.lat, coords.lng, s.lat, s.lng) })).sort((a, b) => a.dist - b.dist);
    }
    return list;
  }, [services, query, category, coords]);

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="display">Daily Services</h2>
        <div className="page-controls">
          <SearchBar value={query} onChange={setQuery} placeholder="Search…" />
          <select className="search-input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {SERVICE_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <LocateButton status={geoStatus} onClick={locate} />
        </div>
      </div>
      {geoError && <p className="auth-error">{geoError}</p>}
      {status === "loading" && <Loader label="Loading services…" />}
      {status === "error" && <ErrorMessage message="Couldn't load services." onRetry={load} />}
      {status === "success" && visible.length === 0 && <EmptyState title="No services found" />}
      {status === "success" && visible.length > 0 && (
        <div className="grid">{visible.map((s) => <ServiceCard key={s._id} service={s} />)}</div>
      )}
    </div>
  );
}
