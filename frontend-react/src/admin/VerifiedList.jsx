import { getListingLabel } from "./listingLabel";

export default function VerifiedList({ items, kind, onUnverify }) {
  if (!items || items.length === 0) {
    return <p className="empty-dash">No verified listings yet.</p>;
  }

  return (
    <div className="dash-list">
      {items.map((item) => {
        const { title, subtitle } = getListingLabel(item, kind);
        return (
          <div className="dash-item" key={item._id}>
            <div className="dash-item-main">
              {title}
              <span className="sub">{subtitle}</span>
            </div>
            <div className="dash-item-actions">
              <span className="badge badge-verified" style={{ position: "static" }}>✓ Verified</span>
              <button className="mini-btn reject" onClick={() => onUnverify(item._id)}>Unverify</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
