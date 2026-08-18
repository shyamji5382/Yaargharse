import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../utils/constants";
import MessOwnerDashboard from "../owner/MessOwnerDashboard";
import RoomOwnerDashboard from "../owner/RoomOwnerDashboard";
import VehicleOwnerDashboard from "../owner/VehicleOwnerDashboard";
import LibraryOwnerDashboard from "../owner/LibraryOwnerDashboard";
import ServiceOwnerDashboard from "../owner/ServiceOwnerDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="page dash-page">
      {user.role === ROLES.MESS_OWNER && <MessOwnerDashboard />}
      {user.role === ROLES.ROOM_OWNER && <RoomOwnerDashboard />}
      {user.role === ROLES.VEHICLE_OWNER && <VehicleOwnerDashboard />}
      {user.role === ROLES.LIBRARY_OWNER && <LibraryOwnerDashboard />}
      {user.role === ROLES.SERVICE_PROVIDER && <ServiceOwnerDashboard />}
    </div>
  );
}
