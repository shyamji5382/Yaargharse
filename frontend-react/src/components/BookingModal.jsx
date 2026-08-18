import { useState, useMemo } from "react";
import { createBooking } from "../services/vehicleBookingService";
import { computeDays, computeRentalAmount } from "../utils/rentalCalc";

export default function BookingModal({ vehicle, onClose, onBooked }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const days = useMemo(() => computeDays(startDate, endDate), [startDate, endDate]);
  const rentalAmount = useMemo(() => computeRentalAmount(vehicle.pricePerDay, days), [vehicle.pricePerDay, days]);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (days === 0) {
      setError("Please pick a valid date range.");
      return;
    }

    setLoading(true);
    try {
      await createBooking({ vehicleId: vehicle._id, startDate, endDate });
      onBooked?.();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h3 className="dash-title" style={{ fontSize: 18 }}>Book {vehicle.brand} {vehicle.model}</h3>

        <form className="dash-form" onSubmit={handleSubmit}>
          <div className="row2">
            <div className="field">
              <label>Start Date</label>
              <input type="date" min={today} required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="field">
              <label>End Date</label>
              <input type="date" min={startDate || today} required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          {days > 0 && (
            <div className="booking-summary">
              <div className="booking-row"><span>Duration</span><strong>{days} day{days !== 1 ? "s" : ""}</strong></div>
              <div className="booking-row"><span>Price / day</span><strong>₹{vehicle.pricePerDay}</strong></div>
              <div className="booking-row booking-total"><span>Rental Amount</span><strong>₹{rentalAmount.toLocaleString("en-IN")}</strong></div>
              <div className="booking-row"><span>Security Deposit (refundable)</span><strong>₹{vehicle.securityDeposit?.toLocaleString("en-IN") || 0}</strong></div>
            </div>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Sending request…" : "Book Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
