import { getListingLabel } from "./listingLabel";

export default function PendingList({ items, kind, onApprove, onReject }) {
  if (!items || items.length === 0) {
    return <p className="empty-dash">Nothing pending right now.</p>;
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
              <button className="mini-btn approve" onClick={() => onApprove(item._id)}>Approve</button>
              <button className="mini-btn reject" onClick={() => onReject(item._id)}>Reject</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
