import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/login.css";

export default function Login({ setShowRegister }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);

  const { refreshUser } = useContext(AuthContext);

  const login = async () => {
    if (!identifier || !password) {
      return alert("⚠️ Enter email/phone and password");
    }

    try {
      setLoadingBtn(true);

      const res = await api.post("/auth/login", {
        identifier,
        password,
      });

      localStorage.setItem("token", res.data.token);

      await refreshUser();

      alert("✅ Login successful");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    } finally {
      setLoadingBtn(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="logo">💳 CredBit</h1>
        <p className="subtitle">Login to your account</p>

        <input
          className="input"
          placeholder="Email or Phone"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="login-btn"
          onClick={login}
          disabled={loadingBtn}
        >
          {loadingBtn ? "Logging in..." : "Login"}
        </button>

        <p className="bottom-text">
          Don't have an account?{" "}
          <span
            className="clickable"
            onClick={() => setShowRegister(true)}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}