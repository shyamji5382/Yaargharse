import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page state-box">
      <h2 className="display">404</h2>
      <p>This page doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Go home</Link>
    </div>
  );
}
