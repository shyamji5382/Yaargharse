import { updateServiceAvailability, deleteService } from "../services/serviceService";

export default function MyServices({ services, onChange }) {
  if (!services || services.length === 0) {
    return <p className="empty-dash">No services yet — add your first one above.</p>;
  }

  const toggle = async (s) => { await updateServiceAvailability(s._id, !s.available); onChange(); };
  const remove = async (id) => { await deleteService(id); onChange(); };

  return (
    <div className="dash-list">
      {services.map((s) => (
        <div className="dash-item" key={s._id}>
          <div className="dash-item-main">{s.name}<span className="sub">{s.category}</span></div>
          <div className="dash-item-actions">
            <span className={`status-badge ${s.status}`}>{s.status}</span>
            <button className="mini-btn delete" onClick={() => toggle(s)}>{s.available ? "Mark Unavailable" : "Mark Available"}</button>
            <button className="mini-btn delete" onClick={() => remove(s._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
