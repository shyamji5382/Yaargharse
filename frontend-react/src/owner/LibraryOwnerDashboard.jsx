import { useEffect, useState, useCallback } from "react";
import { getMyLibraries } from "../services/libraryService";
import AddLibraryForm from "./AddLibraryForm";
import MyLibraries from "./MyLibraries";
import Loader from "../components/Loader";

export default function LibraryOwnerDashboard() {
  const [libraries, setLibraries] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyLibraries();
      setLibraries(data.libraries || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <h3 className="dash-title">Add Your Library</h3>
      <AddLibraryForm onCreated={load} />
      <h3 className="dash-title" style={{ fontSize: 16 }}>Your Libraries</h3>
      {loading ? <Loader label="Loading…" /> : <MyLibraries libraries={libraries} onChange={load} />}
    </div>
  );
}
