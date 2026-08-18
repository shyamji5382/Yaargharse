import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../utils/constants";

const EXPLORE_LINKS = [
  { to: "/messes", label: "🍱 Mess" },
  { to: "/rooms", label: "🏠 Rooms" },
  { to: "/vehicles", label: "🛵 Vehicles" },
  { to: "/libraries", label: "📚 Libraries" },
  { to: "/services", label: "🧺 Daily Services" },
  { to: "/marketplace", label: "🛒 Buy & Sell" },
  { to: "/smart-match", label: "🤖 Smart Match" },
  { to: "/nearby", label: "📍 Nearby Everything" },
  { to: "/student-package", label: "⭐ Student Package" },
  { to: "/student-help", label: "🆘 Student Help" }
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const dashboardLabel = user?.role === ROLES.ADMIN ? "Admin Panel" : "Dashboard";
  const dashboardPath = user?.role === ROLES.ADMIN ? "/admin" : "/dashboard";

  const showDashboard =
    isAuthenticated &&
    [ROLES.MESS_OWNER, ROLES.ROOM_OWNER, ROLES.VEHICLE_OWNER, ROLES.LIBRARY_OWNER, ROLES.SERVICE_PROVIDER, ROLES.ADMIN].includes(user.role);

  const closeAll = () => { setMenuOpen(false); setExploreOpen(false); };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={closeAll}>YaarGharSe</Link>

        <button className="nav-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen((o) => !o)}>
          <span /><span /><span />
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={closeAll}>Home</Link>

          <div className="nav-dropdown">
            <button type="button" className="nav-dropdown-btn" onClick={() => setExploreOpen((o) => !o)}>
              Explore ▾
            </button>
            {exploreOpen && (
              <div className="nav-dropdown-menu">
                {EXPLORE_LINKS.map((l) => (
                  <Link key={l.to} to={l.to} onClick={closeAll}>{l.label}</Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/about" onClick={closeAll}>About</Link>

          {isAuthenticated && <Link to="/my-rentals" onClick={closeAll}>My Rentals</Link>}

          {showDashboard && (
            <Link to={dashboardPath} onClick={closeAll}>{dashboardLabel}</Link>
          )}

          {isAuthenticated ? (
            <div className="nav-user">
              <span className="nav-user-name">👋 {user.name}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="nav-user">
              <Link to="/login" className="btn btn-outline" onClick={closeAll}>Login</Link>
              <Link to="/register" className="btn btn-primary" onClick={closeAll}>Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
