import { distLabel } from "../utils/distance";
import { photoUrl } from "../utils/constants";

export default function MatchCard({ room }) {
  const cover = room.photos?.[0];

  return (
    <div className="card match-card">
      {cover && (
        <div className="card-image">
          <img src={photoUrl(cover)} alt={room.name} loading="lazy" />
          <div className="badge-row">
            <span className="badge badge-match">{room.matchScore}% Match</span>
            {room.verified && <span className="badge badge-verified">✓ Verified</span>}
          </div>
        </div>
      )}

      <div className="card-body">
        <div className="card-top">
          <h3>{room.name}</h3>
          {room.rating > 0 && <span className="rating">★ {room.rating.toFixed(1)}</span>}
        </div>

        <p className="card-sub">{room.gender?.toUpperCase()} · {room.roomType}</p>
        {room.address && <p className="card-meta">📍 {room.address}</p>}
        <p className="card-meta card-meta-dist">{distLabel(room.dist)} from you</p>

        {room.nearbyMess && (
          <p className="card-meta">
            🍱 {room.nearbyMess.type === "both" ? "Veg & Non-veg" : room.nearbyMess.type} mess nearby —{" "}
            {room.nearbyMess.name} ({distLabel(room.nearbyMess.distToRoom)})
          </p>
        )}

        <div className="card-price">
          <span>₹{room.rent?.toLocaleString("en-IN")}/month</span>
          {room.deposit > 0 && <span className="dim">₹{room.deposit.toLocaleString("en-IN")} deposit</span>}
        </div>
      </div>
    </div>
  );
}
