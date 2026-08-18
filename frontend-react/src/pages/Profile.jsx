import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="page auth-page">
      <div className="auth-form-card">
        <h2 className="display">Your Profile</h2>
        <div className="profile-row"><span>Name</span><strong>{user.name}</strong></div>
        <div className="profile-row"><span>Email</span><strong>{user.email}</strong></div>
        <div className="profile-row"><span>Phone</span><strong>{user.phone}</strong></div>
        <div className="profile-row"><span>Role</span><strong>{user.role}</strong></div>
      </div>
    </div>
  );
}
