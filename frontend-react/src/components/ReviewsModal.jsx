import { useEffect, useState } from "react";
import { getReviews, submitReview } from "../services/reviewService";
import { useAuth } from "../hooks/useAuth";

export default function ReviewsModal({ targetType, targetId, title, onClose }) {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [status, setStatus] = useState("loading");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setStatus("loading");
    try {
      const data = await getReviews(targetType, targetId);
      setReviews(data.reviews || []);
      setAverage(data.average || 0);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await submitReview(targetType, targetId, rating, text);
      setText("");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h3 className="dash-title" style={{ fontSize: 18 }}>Reviews — {title}</h3>

        {status === "success" && (
          <p className="card-meta" style={{ marginBottom: 14 }}>
            {average > 0 ? `★ ${average.toFixed(1)} average · ${reviews.length} review${reviews.length !== 1 ? "s" : ""}` : "No reviews yet"}
          </p>
        )}

        {status === "loading" && <p className="empty-dash">Loading reviews…</p>}

        <div className="dash-list" style={{ maxHeight: 220, overflowY: "auto", marginBottom: 16 }}>
          {status === "success" && reviews.length === 0 && (
            <p className="empty-dash">Be the first to review this.</p>
          )}
          {reviews.map((r) => (
            <div className="dash-item" key={r._id} style={{ display: "block" }}>
              <div className="dash-item-main">
                {r.userName} <span className="rating" style={{ marginLeft: 6 }}>★ {r.rating}</span>
                {r.text && <span className="sub" style={{ display: "block", marginTop: 4 }}>{r.text}</span>}
              </div>
            </div>
          ))}
        </div>

        {isAuthenticated ? (
          <form className="dash-form" onSubmit={handleSubmit} style={{ marginBottom: 0 }}>
            <div className="field">
              <label>Your Rating</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
            <div className="field">
              <label>Your Review</label>
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Share your experience…" />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </form>
        ) : (
          <p className="empty-dash">Login to write a review.</p>
        )}
      </div>
    </div>
  );
}
