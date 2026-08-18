import { useEffect, useMemo, useState } from "react";
import { getHelpEntries } from "../services/studentHelpService";
import { HELP_CATEGORIES, photoUrl } from "../utils/constants";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

export default function StudentHelp() {
  const [entries, setEntries] = useState([]);
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("loading");

  const load = async () => {
    setStatus("loading");
    try {
      const data = await getHelpEntries();
      setEntries(Array.isArray(data) ? data : []);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => { load(); }, []);

  const visible = useMemo(
    () => entries.filter((e) => category === "all" || e.category === category),
    [entries, category]
  );

  return (
    <div className="page">
      <div className="sign-tag">🆘 Student Help</div>
      <h2 className="display" style={{ marginBottom: 20 }}>Emergency & Local Help</h2>

      <div className="page-controls" style={{ marginBottom: 20 }}>
        <select className="search-input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {HELP_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
      </div>

      {status === "loading" && <Loader label="Loading…" />}
      {status === "error" && <ErrorMessage message="Couldn't load entries." onRetry={load} />}
      {status === "success" && visible.length === 0 && <EmptyState title="No entries yet" message="Admin hasn't added anything in this category yet." />}

      {status === "success" && visible.length > 0 && (
        <div className="grid">
          {visible.map((e) => (
            <div className="card" key={e._id}>
              {e.photo && (
                <div className="card-image">
                  <img src={photoUrl(e.photo)} alt={e.name} loading="lazy" />
                  <div className="badge-row"><span className="badge badge-verified">✓ Verified</span></div>
                </div>
              )}
              <div className="card-body">
                <h3>{e.name}</h3>
                <p className="card-sub">{HELP_CATEGORIES.find((c) => c.key === e.category)?.label || e.category}</p>
                {e.address && <p className="card-meta">📍 {e.address}</p>}
                {e.availableTime && <p className="card-meta">🕒 {e.availableTime}</p>}
                {e.description && <p className="card-meta">{e.description}</p>}

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <a className="btn btn-primary" style={{ flex: 1 }} href={`tel:${e.contactNumber}`}>📞 Call</a>
                  {e.lat && e.lng && (
                    <a
                      className="btn btn-outline"
                      style={{ flex: 1 }}
                      href={`https://www.google.com/maps?q=${e.lat},${e.lng}`}
                      target="_blank" rel="noreferrer"
                    >
                      📍 Location
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
