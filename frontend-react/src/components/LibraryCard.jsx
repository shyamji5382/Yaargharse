import { useState } from "react";
import { distLabel } from "../utils/distance";
import { photoUrl } from "../utils/constants";
import ReviewsModal from "./ReviewsModal";

export default function LibraryCard({ library }) {
  const [showReviews, setShowReviews] = useState(false);
  const cover = library.photos?.[0];

  return (
    <div className="card">
      {cover && (
        <div className="card-image">
          <img src={photoUrl(cover)} alt={library.name} loading="lazy" />
          <div className="badge-row">
            {library.verified ? (
              <span className="badge badge-verified">✓ YaarGharSe Verified</span>
            ) : (
              <span className="badge badge-unverified">⚠ Not Verified</span>
            )}
            {library.available ? (
              <span className="badge badge-available">🟢 Available</span>
            ) : (
              <span className="badge badge-unavailable">🔴 Not Available</span>
            )}
          </div>
        </div>
      )}

      <div className="card-body">
        <div className="card-top">
          <h3>{library.name}</h3>
          {library.rating > 0 && <span className="rating">★ {library.rating.toFixed(1)}</span>}
        </div>

        {library.address && <p className="card-meta">📍 {library.address}</p>}
        {library.openingHours && <p className="card-meta">🕒 {library.openingHours}</p>}
        <p className="card-meta">🪑 {library.availableSeats} seats available</p>

        {library.facilities?.length > 0 && (
          <p className="card-meta">{library.facilities.join(", ")}</p>
        )}

        {typeof library.dist === "number" && (
          <p className="card-meta card-meta-dist">{distLabel(library.dist)}</p>
        )}

        <div className="card-price"><span>₹{library.price}/month</span></div>

        <p className="safety-score">
          🛡️ Safety Score: {library.safetyScore != null ? `${library.safetyScore}/100` : "Score Unavailable"}
        </p>

        <button type="button" className="btn btn-ghost btn-block" onClick={() => setShowReviews(true)}>
          ★ Reviews
        </button>
      </div>

      {showReviews && (
        <ReviewsModal targetType="library" targetId={library._id} title={library.name} onClose={() => setShowReviews(false)} />
      )}
    </div>
  );
}
