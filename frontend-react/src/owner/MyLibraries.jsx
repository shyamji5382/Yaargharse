import { updateLibraryAvailability, deleteLibrary } from "../services/libraryService";

export default function MyLibraries({ libraries, onChange }) {
  if (!libraries || libraries.length === 0) {
    return <p className="empty-dash">No libraries yet — add your first one above.</p>;
  }

  const toggle = async (l) => { await updateLibraryAvailability(l._id, !l.available); onChange(); };
  const remove = async (id) => { await deleteLibrary(id); onChange(); };

  return (
    <div className="dash-list">
      {libraries.map((l) => (
        <div className="dash-item" key={l._id}>
          <div className="dash-item-main">{l.name}<span className="sub">₹{l.price}/month · {l.availableSeats} seats</span></div>
          <div className="dash-item-actions">
            <span className={`status-badge ${l.status}`}>{l.status}</span>
            <button className="mini-btn delete" onClick={() => toggle(l)}>{l.available ? "Mark Unavailable" : "Mark Available"}</button>
            <button className="mini-btn delete" onClick={() => remove(l._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
