import { useState } from "react";
import { distLabel } from "../utils/distance";
import { photoUrl, SERVICE_CATEGORIES } from "../utils/constants";
import ReviewsModal from "./ReviewsModal";

export default function ServiceCard({ service }) {
  const [showReviews, setShowReviews] = useState(false);
  const cover = service.photos?.[0];
  const categoryLabel = SERVICE_CATEGORIES.find((c) => c.key === service.category)?.label || service.category;

  return (
    <div className="card">
      {cover && (
        <div className="card-image">
          <img src={photoUrl(cover)} alt={service.name} loading="lazy" />
          <div className="badge-row">
            {service.verified ? (
              <span className="badge badge-verified">✓ YaarGharSe Verified</span>
            ) : (
              <span className="badge badge-unverified">⚠ Not Verified</span>
            )}
            {service.available ? (
              <span className="badge badge-available">🟢 Available</span>
            ) : (
              <span className="badge badge-unavailable">🔴 Not Available</span>
            )}
          </div>
        </div>
      )}

      <div className="card-body">
        <div className="card-top">
          <h3>{service.name}</h3>
          {service.rating > 0 && <span className="rating">★ {service.rating.toFixed(1)}</span>}
        </div>

        <p className="card-sub">{categoryLabel}</p>
        {service.address && <p className="card-meta">📍 {service.address}</p>}
        {service.availableTime && <p className="card-meta">🕒 {service.availableTime}</p>}
        <p className="card-meta">📞 {service.contactNumber}</p>

        {typeof service.dist === "number" && (
          <p className="card-meta card-meta-dist">{distLabel(service.dist)}</p>
        )}

        {service.price && <div className="card-price"><span>₹{service.price}</span></div>}

        <p className="safety-score">
          🛡️ Safety Score: {service.safetyScore != null ? `${service.safetyScore}/100` : "Score Unavailable"}
        </p>

        <button type="button" className="btn btn-ghost btn-block" onClick={() => setShowReviews(true)}>
          ★ Reviews
        </button>
      </div>

      {showReviews && (
        <ReviewsModal targetType="service" targetId={service._id} title={service.name} onClose={() => setShowReviews(false)} />
      )}
    </div>
  );
}
