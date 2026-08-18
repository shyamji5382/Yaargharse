import { useEffect, useState, useCallback } from "react";
import { getMyBookings } from "../services/vehicleBookingService";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

const STATUS_LABEL = {
  pending: "Waiting for owner",
  accepted: "Confirmed",
  rejected: "Declined"
};

export default function MyRentals() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("loading");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await getMyBookings();
      setBookings(data.bookings || []);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="page">
      <h2 className="display" style={{ marginBottom: 20 }}>My Rentals</h2>

      {status === "loading" && <Loader label="Loading your rentals…" />}
      {status === "error" && <ErrorMessage message="Couldn't load your rentals." onRetry={load} />}
      {status === "success" && bookings.length === 0 && (
        <EmptyState title="No rentals yet" message="Book a vehicle to see it here." />
      )}

      {status === "success" && bookings.length > 0 && (
        <div className="dash-list" style={{ maxWidth: 640 }}>
          {bookings.map((b) => (
            <div className="dash-item" key={b._id}>
              <div className="dash-item-main">
                {b.vehicleName}
                <span className="sub">
                  {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()} ·
                  {" "}{b.days} day{b.days !== 1 ? "s" : ""}
                </span>
                <span className="sub">
                  ₹{b.rentalAmount.toLocaleString("en-IN")} rental
                  {b.securityDeposit > 0 && ` + ₹${b.securityDeposit.toLocaleString("en-IN")} deposit`}
                </span>
              </div>
              <div className="dash-item-actions">
                <span className={`status-badge ${b.status === "accepted" ? "approved" : "pending"}`}>
                  {STATUS_LABEL[b.status] || b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
