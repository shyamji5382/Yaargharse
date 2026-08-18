import { respondBooking } from "../services/vehicleBookingService";

export default function OwnerBookings({ bookings, onChange }) {
  if (!bookings || bookings.length === 0) {
    return <p className="empty-dash">No booking requests yet.</p>;
  }

  const handleRespond = async (id, action) => {
    await respondBooking(id, action);
    onChange();
  };

  return (
    <div className="dash-list">
      {bookings.map((b) => (
        <div className="dash-item" key={b._id}>
          <div className="dash-item-main">
            {b.vehicleName}
            <span className="sub">
              {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()} ·
              {" "}{b.days} day{b.days !== 1 ? "s" : ""} · ₹{b.rentalAmount.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="dash-item-actions">
            {b.status === "pending" ? (
              <>
                <button className="mini-btn approve" onClick={() => handleRespond(b._id, "accept")}>Accept</button>
                <button className="mini-btn reject" onClick={() => handleRespond(b._id, "reject")}>Reject</button>
              </>
            ) : (
              <span className={`status-badge ${b.status === "accepted" ? "approved" : "pending"}`}>{b.status}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
