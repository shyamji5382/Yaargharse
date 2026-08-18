import { useState } from "react";
import { photoUrl, ITEM_CATEGORIES, ITEM_CONDITIONS } from "../utils/constants";
import { reportItem } from "../services/buySellService";
import { useAuth } from "../hooks/useAuth";

export default function ItemCard({ item }) {
  const [showContact, setShowContact] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const { isAuthenticated } = useAuth();

  const cover = item.photos?.[0];
  const categoryLabel = ITEM_CATEGORIES.find((c) => c.key === item.category)?.label || item.category;
  const conditionLabel = ITEM_CONDITIONS.find((c) => c.key === item.condition)?.label || item.condition;

  const handleReport = async () => {
    const reason = window.prompt("Why are you reporting this listing?");
    if (!reason) return;
    setReporting(true);
    try {
      await reportItem(item._id, reason);
      setReportSent(true);
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="card">
      {cover && (
        <div className="card-image">
          <img src={photoUrl(cover)} alt={item.itemName} loading="lazy" />
          <div className="badge-row">
            {item.sold ? (
              <span className="badge badge-unavailable">🔴 Sold</span>
            ) : (
              <span className="badge badge-available">🟢 Available</span>
            )}
          </div>
        </div>
      )}

      <div className="card-body">
        <div className="card-top">
          <h3>{item.itemName}</h3>
        </div>

        <p className="card-sub">{categoryLabel} · {conditionLabel}</p>
        {item.address && <p className="card-meta">📍 {item.address}</p>}
        {item.description && <p className="card-meta">{item.description}</p>}
        <p className="card-meta">Seller: {item.sellerName} · {new Date(item.createdAt).toLocaleDateString()}</p>

        <div className="card-price">
          <span>₹{item.price?.toLocaleString("en-IN")}</span>
        </div>

        {!item.sold && (
          <div className="item-actions">
            {isAuthenticated ? (
              showContact ? (
                item.showContact && item.contactNumber ? (
                  <p className="booking-sent">📞 {item.contactNumber}</p>
                ) : (
                  <p className="empty-dash" style={{ padding: "8px 0" }}>Seller hasn't shared a contact number.</p>
                )
              ) : (
                <button className="btn btn-primary btn-block" onClick={() => setShowContact(true)}>
                  Contact Seller
                </button>
              )
            ) : (
              <button className="btn btn-primary btn-block" disabled title="Login to contact seller">
                Login to Contact Seller
              </button>
            )}

            {isAuthenticated && !reportSent && (
              <button className="btn btn-ghost btn-block" style={{ marginTop: 6 }} onClick={handleReport} disabled={reporting}>
                {reporting ? "Reporting…" : "🚩 Report Listing"}
              </button>
            )}
            {reportSent && <p className="field-hint" style={{ textAlign: "center", marginTop: 6 }}>Reported — thank you</p>}
          </div>
        )}
      </div>
    </div>
  );
}
