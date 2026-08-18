import { Link } from "react-router-dom";

const CATEGORIES = [
  { to: "/messes", icon: "🍱", label: "Mess", desc: "Find verified mess & tiffin near you" },
  { to: "/rooms", icon: "🏠", label: "Rooms", desc: "PG and room listings, verified" },
  { to: "/vehicles", icon: "🛵", label: "Vehicles", desc: "Rent a scooty, bike, or car" },
  { to: "/libraries", icon: "📚", label: "Libraries", desc: "Study spaces with seats & hours" },
  { to: "/services", icon: "🧺", label: "Daily Services", desc: "Laundry, printing, water & more" },
  { to: "/marketplace", icon: "🛒", label: "Buy & Sell", desc: "Books, furniture, electronics" },
  { to: "/smart-match", icon: "🤖", label: "Smart Match", desc: "Find your perfect room by budget" },
  { to: "/nearby", icon: "📍", label: "Nearby Everything", desc: "Everything close to you, sorted" },
  { to: "/student-package", icon: "⭐", label: "Student Package", desc: "Plan your monthly budget" },
  { to: "/student-help", icon: "🆘", label: "Student Help", desc: "Emergency contacts & local help" }
];

export default function Home() {
  return (
    <div className="page hero-page">
      <div className="sign-tag">YaarGharSe · open now</div>
      <h1 className="display">
        Ghar jaisa mess & <span>rooms nearby</span>
      </h1>
      <p className="hero-text">
        Verified mess and PG/room listings for students — added by real owners,
        reviewed by our team before they go live.
      </p>
      <div className="hero-actions">
        <Link to="/messes" className="btn btn-primary">Find a Mess</Link>
        <Link to="/rooms" className="btn btn-outline">Find a Room</Link>
      </div>

      <h2 className="display" style={{ fontSize: 20, margin: "44px 0 18px", textAlign: "left" }}>
        Explore Everything
      </h2>

      <div className="category-grid">
        {CATEGORIES.map((c) => (
          <Link to={c.to} key={c.to} className="category-card">
            <span className="category-icon">{c.icon}</span>
            <span className="category-label">{c.label}</span>
            <span className="category-desc">{c.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}