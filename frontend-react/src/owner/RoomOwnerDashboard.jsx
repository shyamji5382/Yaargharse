import { useEffect, useState, useCallback } from "react";
import { getMyRooms, deleteRoom } from "../services/roomService";
import AddRoomForm from "./AddRoomForm";
import MyListings from "./MyListings";
import Loader from "../components/Loader";

export default function RoomOwnerDashboard() {
  const [rooms, setRooms] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyRooms();
      setRooms(data.rooms || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    await deleteRoom(id);
    load();
  };

  return (
    <div>
      <h3 className="dash-title">Add Your Room / PG</h3>
      <AddRoomForm onCreated={load} />

      <h3 className="dash-title" style={{ fontSize: 16 }}>Your Listings</h3>
      {loading ? <Loader label="Loading your listings…" /> : (
        <MyListings items={rooms} kind="room" onDelete={handleDelete} />
      )}
    </div>
  );
}
