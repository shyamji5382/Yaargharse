import { updateAvailability, deleteVehicle } from "../services/vehicleService";

export default function MyVehicles({ vehicles, onChange }) {
  if (!vehicles || vehicles.length === 0) {
    return <p className="empty-dash">No vehicles yet — add your first one above.</p>;
  }

  const toggleAvailability = async (v) => {
    await updateAvailability(v._id, !v.available);
    onChange();
  };

  const handleDelete = async (id) => {
    await deleteVehicle(id);
    onChange();
  };

  return (
    <div className="dash-list">
      {vehicles.map((v) => (
        <div className="dash-item" key={v._id}>
          <div className="dash-item-main">
            {v.brand} {v.model}
            <span className="sub">₹{v.pricePerDay}/day · {v.type}</span>
          </div>
          <div className="dash-item-actions">
            <span className={`status-badge ${v.status}`}>{v.status}</span>
            <button className="mini-btn delete" onClick={() => toggleAvailability(v)}>
              {v.available ? "Mark Unavailable" : "Mark Available"}
            </button>
            <button className="mini-btn delete" onClick={() => handleDelete(v._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
