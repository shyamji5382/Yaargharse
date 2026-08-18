import { useEffect, useState, useCallback } from "react";
import { getMyMesses, deleteMess } from "../services/messService";
import AddMessForm from "./AddMessForm";
import MyListings from "./MyListings";
import Loader from "../components/Loader";

export default function MessOwnerDashboard() {
  const [messes, setMesses] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyMesses();
      setMesses(data.messes || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    await deleteMess(id);
    load();
  };

  return (
    <div>
      <h3 className="dash-title">Add Your Mess</h3>
      <AddMessForm onCreated={load} />

      <h3 className="dash-title" style={{ fontSize: 16 }}>Your Listings</h3>
      {loading ? <Loader label="Loading your listings…" /> : (
        <MyListings items={messes} kind="mess" onDelete={handleDelete} />
      )}
    </div>
  );
}
