export default function Loader({ label = "Loading…" }) {
  return (
    <div className="state-box loader-box" role="status" aria-live="polite">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}
