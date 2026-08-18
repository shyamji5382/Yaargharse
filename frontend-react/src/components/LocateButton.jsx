export default function LocateButton({ status, onClick }) {
  const label =
    status === "locating" ? "Locating…" : status === "done" ? "📍 Sorted by distance" : "📍 Sort by distance";

  return (
    <button className="btn btn-outline" onClick={onClick} disabled={status === "locating"}>
      {label}
    </button>
  );
}
