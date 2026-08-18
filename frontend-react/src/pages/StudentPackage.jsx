import { useEffect, useState } from "react";
import { getRooms } from "../services/roomService";
import { getMesses } from "../services/messService";
import { getLibraries } from "../services/libraryService";
import { getVehicles } from "../services/vehicleService";
import Loader from "../components/Loader";

export default function StudentPackage() {
  const [rooms, setRooms] = useState([]);
  const [messes, setMesses] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [roomId, setRoomId] = useState("");
  const [messId, setMessId] = useState("");
  const [libraryId, setLibraryId] = useState("");
  const [vehicleId, setVehicleId] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [r, m, l, v] = await Promise.all([getRooms(), getMesses(), getLibraries(), getVehicles()]);
        setRooms(Array.isArray(r) ? r : []);
        setMesses(Array.isArray(m) ? m : []);
        setLibraries(Array.isArray(l) ? l : []);
        setVehicles(Array.isArray(v) ? v.filter((x) => x.available) : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectedRoom = rooms.find((r) => r._id === roomId);
  const selectedMess = messes.find((m) => m._id === messId);
  const selectedLibrary = libraries.find((l) => l._id === libraryId);
  const selectedVehicle = vehicles.find((v) => v._id === vehicleId);

  const roomCost = selectedRoom?.rent || 0;
  const messCost = selectedMess?.priceMonthly || 0;
  const libraryCost = selectedLibrary?.price || 0;
  const vehicleCost = selectedVehicle ? selectedVehicle.pricePerDay * 30 : 0;

  const total = roomCost + messCost + libraryCost + vehicleCost;

  if (loading) return <div className="page"><Loader label="Loading options…" /></div>;

  return (
    <div className="page">
      <div className="sign-tag">⭐ Build My Student Package</div>
      <h2 className="display" style={{ marginBottom: 20 }}>Plan Your Monthly Budget</h2>

      <div className="dash-form" style={{ maxWidth: 520 }}>
        <div className="field">
          <label>🏠 Room</label>
          <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
            <option value="">None</option>
            {rooms.map((r) => <option key={r._id} value={r._id}>{r.name} — ₹{r.rent}/month</option>)}
          </select>
        </div>

        <div className="field">
          <label>🍱 Mess</label>
          <select value={messId} onChange={(e) => setMessId(e.target.value)}>
            <option value="">None</option>
            {messes.map((m) => <option key={m._id} value={m._id}>{m.name} — ₹{m.priceMonthly}/month</option>)}
          </select>
        </div>

        <div className="field">
          <label>📚 Library</label>
          <select value={libraryId} onChange={(e) => setLibraryId(e.target.value)}>
            <option value="">None</option>
            {libraries.map((l) => <option key={l._id} value={l._id}>{l.name} — ₹{l.price}/month</option>)}
          </select>
        </div>

        <div className="field">
          <label>🛵 Vehicle (30-day estimate)</label>
          <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
            <option value="">None</option>
            {vehicles.map((v) => <option key={v._id} value={v._id}>{v.brand} {v.model} — ₹{v.pricePerDay}/day</option>)}
          </select>
        </div>
      </div>

      <div className="booking-summary" style={{ maxWidth: 520, marginTop: 20 }}>
        <div className="booking-row"><span>Room</span><strong>₹{roomCost.toLocaleString("en-IN")}</strong></div>
        <div className="booking-row"><span>Mess</span><strong>₹{messCost.toLocaleString("en-IN")}</strong></div>
        <div className="booking-row"><span>Library</span><strong>₹{libraryCost.toLocaleString("en-IN")}</strong></div>
        <div className="booking-row">
          <span>Vehicle {selectedVehicle && "(estimated)"}</span>
          <strong>₹{vehicleCost.toLocaleString("en-IN")}</strong>
        </div>
        <div className="booking-row booking-total"><span>Total Monthly Cost</span><strong>₹{total.toLocaleString("en-IN")}</strong></div>
      </div>

      <p className="field-hint" style={{ maxWidth: 520, marginTop: 10 }}>
        Only currently available, approved listings are shown. Vehicle cost is a 30-day estimate from its daily rate.
      </p>
    </div>
  );
}
