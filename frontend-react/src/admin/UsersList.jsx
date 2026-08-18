export default function UsersList({ users }) {
  if (!users || users.length === 0) {
    return <p className="empty-dash">No users yet.</p>;
  }

  return (
    <div className="dash-list">
      {users.map((u) => (
        <div className="dash-item" key={u._id}>
          <div className="dash-item-main">
            {u.name}
            <span className="sub">{u.email} · {u.role}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
