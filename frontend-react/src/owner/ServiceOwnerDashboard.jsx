import { useEffect, useState, useCallback } from "react";
import { getMyServices } from "../services/serviceService";
import AddServiceForm from "./AddServiceForm";
import MyServices from "./MyServices";
import Loader from "../components/Loader";

export default function ServiceOwnerDashboard() {
  const [services, setServices] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyServices();
      setServices(data.services || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <h3 className="dash-title">Add Your Service</h3>
      <AddServiceForm onCreated={load} />
      <h3 className="dash-title" style={{ fontSize: 16 }}>Your Services</h3>
      {loading ? <Loader label="Loading…" /> : <MyServices services={services} onChange={load} />}
    </div>
  );
}
