import { useState } from "react";
import { distLabel } from "../utils/distance";
import { DAYS, MEALS, photoUrl } from "../utils/constants";
import ReviewsModal from "./ReviewsModal";

export default function MessCard({ mess }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const cover = mess.photos?.[0];

  return (
    <div className="card">
      {cover && (
        <div className="card-image">
          <img src={photoUrl(cover)} alt={mess.name} loading="lazy" />
          <div className="badge-row">
            {mess.verified ? (
              <span className="badge badge-verified">✓ YaarGharSe Verified</span>
            ) : (
              <span className="badge badge-unverified">⚠ Not Verified</span>
            )}
          </div>
        </div>
      )}

      <div className="card-body">
        <div className="card-top">
          <h3>{mess.name}</h3>
          {mess.rating > 0 && <span className="rating">★ {mess.rating.toFixed(1)}</span>}
        </div>

        <p className="card-sub">
          {mess.type?.toUpperCase()} {mess.cuisine?.length ? `· ${mess.cuisine.join(", ")}` : ""}
        </p>

        {mess.address && <p className="card-meta">📍 {mess.address}</p>}
        {mess.timing && <p className="card-meta">🕒 {mess.timing}</p>}

        {typeof mess.dist === "number" && (
          <p className="card-meta card-meta-dist">{distLabel(mess.dist)}</p>
        )}

        <div className="card-price">
          <span>₹{mess.pricePerMeal}/meal</span>
          <span className="dim">₹{mess.priceMonthly}/month</span>
        </div>

        <p className="safety-score">
          🛡️ Safety Score: {mess.safetyScore != null ? `${mess.safetyScore}/100` : "Score Unavailable"}
        </p>

        <button type="button" className="btn btn-ghost btn-block" onClick={() => setShowReviews(true)}>
          ★ Reviews
        </button>

        {mess.weeklyMenu && (
          <>
            <button
              type="button"
              className="btn btn-ghost btn-block menu-toggle"
              onClick={() => setShowMenu((s) => !s)}
            >
              {showMenu ? "Hide menu" : "View weekly menu"}
            </button>

            {showMenu && (
              <div className="menu-table-wrap">
                <table className="menu-table menu-table-view">
                  <thead>
                    <tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th></tr>
                  </thead>
                  <tbody>
                    {DAYS.map((d) => (
                      <tr key={d.key}>
                        <td className="menu-day">{d.label.slice(0, 3)}</td>
                        {MEALS.map((meal) => (
                          <td key={meal}>{mess.weeklyMenu[d.key]?.[meal] || "—"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {showReviews && (
        <ReviewsModal targetType="mess" targetId={mess._id} title={mess.name} onClose={() => setShowReviews(false)} />
      )}
    </div>
  );
}
