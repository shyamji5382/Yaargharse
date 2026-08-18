export default function MyListings({ items, kind, onDelete }) {
  if (!items) return null;

  if (items.length === 0) {
    return <p className="empty-dash">No listings yet — add your first {kind} above.</p>;
  }

  return (
    <div className="dash-list">
      {items.map((item) => (
        <div className="dash-item" key={item._id}>
          <div className="dash-item-main">
            {item.name}
            <span className="sub">
              {kind === "room"
                ? `₹${item.rent}/month · ${item.roomType}`
                : `₹${item.pricePerMeal}/meal · ${item.type}`}
            </span>
          </div>
          <div className="dash-item-actions">
            <span className={`status-badge ${item.status}`}>{item.status}</span>
            <button className="mini-btn delete" onClick={() => onDelete(item._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
