import { useEffect, useState, useCallback } from "react";
import * as adminService from "../services/adminService";
import PendingList from "./PendingList";
import VerifiedList from "./VerifiedList";
import UsersList from "./UsersList";
import StudentHelpAdmin from "./StudentHelpAdmin";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const TABS = [
  { key: "messes", label: "Pending Messes" },
  { key: "rooms", label: "Pending Rooms" },
  { key: "vehicles", label: "Pending Vehicles" },
  { key: "libraries", label: "Pending Libraries" },
  { key: "services", label: "Pending Services" },
  { key: "buysell", label: "Pending Items" },
  { key: "verifiedMesses", label: "Verified Messes" },
  { key: "verifiedRooms", label: "Verified Rooms" },
  { key: "verifiedVehicles", label: "Verified Vehicles" },
  { key: "verifiedLibraries", label: "Verified Libraries" },
  { key: "verifiedServices", label: "Verified Services" },
  { key: "studentHelp", label: "Student Help" },
  { key: "users", label: "Users" }
];

const PENDING_KEYS = ["messes", "rooms", "vehicles", "libraries", "services", "buysell"];
const VERIFIED_KEYS = ["verifiedMesses", "verifiedRooms", "verifiedVehicles", "verifiedLibraries", "verifiedServices"];

const VERIFIED_TO_PENDING_KEY = {
  verifiedMesses: "messes", verifiedRooms: "rooms", verifiedVehicles: "vehicles",
  verifiedLibraries: "libraries", verifiedServices: "services"
};

const EMPTY_PENDING = { messes: [], rooms: [], vehicles: [], libraries: [], services: [], buysell: [] };
const EMPTY_VERIFIED = { messes: [], rooms: [], vehicles: [], libraries: [], services: [] };

export default function AdminDashboard() {
  const [tab, setTab] = useState("messes");
  const [pending, setPending] = useState(EMPTY_PENDING);
  const [verified, setVerified] = useState(EMPTY_VERIFIED);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [bulkLoading, setBulkLoading] = useState(false);

  const loadPending = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await adminService.getPending();
      setPending({
        messes: data.messes || [], rooms: data.rooms || [], vehicles: data.vehicles || [],
        libraries: data.libraries || [], services: data.services || [], buysell: data.buysell || []
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, []);

  const loadVerified = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await adminService.getVerified();
      setVerified({
        messes: data.messes || [], rooms: data.rooms || [], vehicles: data.vehicles || [],
        libraries: data.libraries || [], services: data.services || []
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await adminService.getUsers();
      setUsers(data.users || []);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (tab === "users") loadUsers();
    else if (tab === "studentHelp") setStatus("success");
    else if (VERIFIED_KEYS.includes(tab)) loadVerified();
    else loadPending();
  }, [tab, loadPending, loadVerified, loadUsers]);

  const isPendingTab = PENDING_KEYS.includes(tab);
  const isVerifiedTab = VERIFIED_KEYS.includes(tab);

  const approveFns = {
    messes: adminService.approveMess, rooms: adminService.approveRoom, vehicles: adminService.approveVehicle,
    libraries: adminService.approveLibrary, services: adminService.approveService, buysell: adminService.approveItem
  };
  const rejectFns = {
    messes: adminService.rejectMess, rooms: adminService.rejectRoom, vehicles: adminService.rejectVehicle,
    libraries: adminService.rejectLibrary, services: adminService.rejectService, buysell: adminService.rejectItem
  };
  const unverifyFns = {
    messes: adminService.unverifyMess, rooms: adminService.unverifyRoom, vehicles: adminService.unverifyVehicle,
    libraries: adminService.unverifyLibrary, services: adminService.unverifyService
  };

  const handleApprove = async (id) => { await approveFns[tab](id); loadPending(); };
  const handleReject = async (id) => { await rejectFns[tab](id); loadPending(); };
  const handleUnverify = async (id) => { await unverifyFns[VERIFIED_TO_PENDING_KEY[tab]](id); loadVerified(); };

  const handleApproveAll = async () => {
    const items = pending[tab];
    if (!items || items.length === 0) return;
    const confirmed = window.confirm(`Approve all ${items.length} pending ${tab}?`);
    if (!confirmed) return;

    setBulkLoading(true);
    try {
      await Promise.all(items.map((item) => approveFns[tab](item._id)));
      await loadPending();
    } finally {
      setBulkLoading(false);
    }
  };

  const currentPendingItems = pending[tab];
  const currentVerifiedItems = verified[VERIFIED_TO_PENDING_KEY[tab]];

  return (
    <div>
      <h3 className="dash-title">Admin Panel</h3>

      <div className="dash-tabs" style={{ flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`dash-tab-btn ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {status === "success" && isPendingTab && currentPendingItems.length > 0 && (
        <div className="admin-bulk-row">
          <span className="empty-dash" style={{ padding: 0 }}>{currentPendingItems.length} pending</span>
          <button className="btn btn-primary" onClick={handleApproveAll} disabled={bulkLoading}>
            {bulkLoading ? "Approving…" : `Approve All (${currentPendingItems.length})`}
          </button>
        </div>
      )}

      {status === "loading" && <Loader label="Loading…" />}
      {status === "error" && (
        <ErrorMessage
          message="Couldn't load admin data."
          onRetry={tab === "users" ? loadUsers : isPendingTab ? loadPending : loadVerified}
        />
      )}

      {status === "success" && tab === "users" && <UsersList users={users} />}
      {status === "success" && tab === "studentHelp" && <StudentHelpAdmin />}

      {status === "success" && isPendingTab && (
        <PendingList items={currentPendingItems} kind={tab} onApprove={handleApprove} onReject={handleReject} />
      )}

      {status === "success" && isVerifiedTab && (
        <VerifiedList items={currentVerifiedItems} kind={tab} onUnverify={handleUnverify} />
      )}
    </div>
  );
}
