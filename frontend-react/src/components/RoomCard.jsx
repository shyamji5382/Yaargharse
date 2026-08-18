import { useState } from "react";
import { distLabel } from "../utils/distance";
import { photoUrl } from "../utils/constants";
import ReviewsModal from "./ReviewsModal";

export default function RoomCard({ room }) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [showReviews, setShowReviews] = useState(false);
  const photos = room.photos || [];

  return (
    <div className="card">
      {photos.length > 0 && (
        <div className="card-image">
          <img src={photoUrl(photos[activePhoto])} alt={room.name} loading="lazy" />
          <div className="badge-row">
            {room.verified ? (
              <span className="badge badge-verified">✓ YaarGharSe Verified</span>
            ) : (
              <span className="badge badge-unverified">⚠ Not Verified</span>
            )}
          </div>
          {photos.length > 1 && (
            <div className="photo-dots">
              {photos.map((_, i) => (
                <button
                  key={i}
                  className={`photo-dot ${i === activePhoto ? "active" : ""}`}
                  onClick={() => setActivePhoto(i)}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="card-body">
        <div className="card-top">
          <h3>{room.name}</h3>
          {room.rating > 0 && <span className="rating">★ {room.rating.toFixed(1)}</span>}
        </div>

        <p className="card-sub">
          {room.gender?.toUpperCase()} · {room.roomType}
        </p>

        {room.address && <p className="card-meta">📍 {room.address}</p>}

        {room.facilities?.length > 0 && (
          <p className="card-meta">{room.facilities.join(", ")}</p>
        )}

        {typeof room.dist === "number" && (
          <p className="card-meta card-meta-dist">{distLabel(room.dist)}</p>
        )}

        <div className="card-price">
          <span>₹{room.rent?.toLocaleString("en-IN")}/month</span>
          {room.deposit > 0 && (
            <span className="dim">₹{room.deposit.toLocaleString("en-IN")} deposit</span>
          )}
        </div>

        <p className="safety-score">
          🛡️ Safety Score: {room.safetyScore != null ? `${room.safetyScore}/100` : "Score Unavailable"}
        </p>

        <button type="button" className="btn btn-ghost btn-block" onClick={() => setShowReviews(true)}>
          ★ Reviews
        </button>
      </div>

      {showReviews && (
        <ReviewsModal targetType="room" targetId={room._id} title={room.name} onClose={() => setShowReviews(false)} />
      )}
    </div>
  );
}
