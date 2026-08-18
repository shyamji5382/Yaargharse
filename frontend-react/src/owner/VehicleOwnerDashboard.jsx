import { useEffect, useState, useCallback } from "react";
import { getMyVehicles } from "../services/vehicleService";
import { getOwnerBookings } from "../services/vehicleBookingService";
import AddVehicleForm from "./AddVehicleForm";
import MyVehicles from "./MyVehicles";
import OwnerBookings from "./OwnerBookings";
import Loader from "../components/Loader";

export default function VehicleOwnerDashboard() {
  const [vehicles, setVehicles] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [vData, bData] = await Promise.all([getMyVehicles(), getOwnerBookings()]);
      setVehicles(vData.vehicles || []);
      setBookings(bData.bookings || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  return (
    <div>
      <h3 className="dash-title">Add Your Vehicle</h3>
      <AddVehicleForm onCreated={loadAll} />

      <h3 className="dash-title" style={{ fontSize: 16 }}>Booking Requests</h3>
      {loading ? <Loader label="Loading…" /> : <OwnerBookings bookings={bookings} onChange={loadAll} />}

      <h3 className="dash-title" style={{ fontSize: 16, marginTop: 26 }}>Your Vehicles</h3>
      {loading ? <Loader label="Loading…" /> : <MyVehicles vehicles={vehicles} onChange={loadAll} />}
    </div>
  );
}
