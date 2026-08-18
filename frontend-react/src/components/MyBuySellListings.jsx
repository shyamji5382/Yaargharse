import { markSold, deleteItem } from "../services/buySellService";

export default function MyBuySellListings({ items, onChange }) {
  if (!items || items.length === 0) {
    return <p className="empty-dash">No listings yet — sell your first item above.</p>;
  }

  const toggleSold = async (item) => {
    await markSold(item._id, !item.sold);
    onChange();
  };

  const handleDelete = async (id) => {
    await deleteItem(id);
    onChange();
  };

  return (
    <div className="dash-list">
      {items.map((item) => (
        <div className="dash-item" key={item._id}>
          <div className="dash-item-main">
            {item.itemName}
            <span className="sub">₹{item.price?.toLocaleString("en-IN")} · {item.condition}</span>
          </div>
          <div className="dash-item-actions">
            <span className={`status-badge ${item.status}`}>{item.status}</span>
            <span className={`status-badge ${item.sold ? "pending" : "approved"}`}>{item.sold ? "sold" : "available"}</span>
            <button className="mini-btn delete" onClick={() => toggleSold(item)}>
              {item.sold ? "Mark Available" : "Mark Sold"}
            </button>
            <button className="mini-btn delete" onClick={() => handleDelete(item._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
