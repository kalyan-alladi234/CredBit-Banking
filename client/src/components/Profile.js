import { useState } from "react";
import api from "../api/axios";

export default function Profile({ user, refreshUser }) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [loading, setLoading] = useState(false);

  const updateProfile = async () => {
    if (!name || !email || !phone) {
      return alert("⚠️ All fields required");
    }

    try {
      setLoading(true);

      await api.put("/auth/update", {
        name,
        email,
        phone,
      });

      alert("✅ Profile updated");
      refreshUser();
    } catch (err) {
      alert(err.response?.data?.msg || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile">
      <h2>Edit Profile</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
      />

      <button onClick={updateProfile} disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}