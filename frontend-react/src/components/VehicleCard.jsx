import { useState } from "react";
import { photoUrl, VEHICLE_TYPES } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";
import BookingModal from "./BookingModal";
import ReviewsModal from "./ReviewsModal";

export default function VehicleCard({ vehicle }) {
  const [showBooking, setShowBooking] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [booked, setBooked] = useState(false);
  const { isAuthenticated } = useAuth();

  const cover = vehicle.photos?.[0];
  const typeLabel = VEHICLE_TYPES.find((t) => t.key === vehicle.type)?.label || vehicle.type;

  return (
    <div className="card">
      {cover && (
        <div className="card-image">
          <img src={photoUrl(cover)} alt={`${vehicle.brand} ${vehicle.model}`} loading="lazy" />
          <div className="badge-row">
            {vehicle.verified && <span className="badge badge-verified">✓ Verified</span>}
            {vehicle.available ? (
              <span className="badge badge-available">🟢 Available</span>
            ) : (
              <span className="badge badge-unavailable">🔴 Not Available</span>
            )}
          </div>
        </div>
      )}

      <div className="card-body">
        <div className="card-top">
          <h3>{vehicle.brand} {vehicle.model}</h3>
          {vehicle.rating > 0 && <span className="rating">★ {vehicle.rating.toFixed(1)}</span>}
        </div>

        <p className="card-sub">{typeLabel}</p>
        {vehicle.address && <p className="card-meta">📍 {vehicle.address}</p>}
        {vehicle.details && <p className="card-meta">{vehicle.details}</p>}

        <div className="card-price">
          <span>₹{vehicle.pricePerDay}/day</span>
          {vehicle.securityDeposit > 0 && (
            <span className="dim">₹{vehicle.securityDeposit.toLocaleString("en-IN")} deposit</span>
          )}
        </div>

        <p className="safety-score">
          🛡️ Safety Score: {vehicle.safetyScore != null ? `${vehicle.safetyScore}/100` : "Score Unavailable"}
        </p>

        {vehicle.available && (
          booked ? (
            <p className="booking-sent">✓ Request sent — waiting for owner</p>
          ) : (
            <button
              className="btn btn-primary btn-block"
              style={{ marginTop: 12 }}
              onClick={() => setShowBooking(true)}
              disabled={!isAuthenticated}
              title={!isAuthenticated ? "Login to book" : ""}
            >
              {isAuthenticated ? "Book Now" : "Login to Book"}
            </button>
          )
        )}

        <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: 8 }} onClick={() => setShowReviews(true)}>
          ★ Reviews
        </button>
      </div>

      {showBooking && (
        <BookingModal
          vehicle={vehicle}
          onClose={() => setShowBooking(false)}
          onBooked={() => { setBooked(true); setShowBooking(false); }}
        />
      )}

      {showReviews && (
        <ReviewsModal
          targetType="vehicle"
          targetId={vehicle._id}
          title={`${vehicle.brand} ${vehicle.model}`}
          onClose={() => setShowReviews(false)}
        />
      )}
    </div>
  );
}
