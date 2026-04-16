import { useState } from "react";
import api from "../api/axios";
import "../styles/login.css";

export default function Register({ setShowRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    if (!name || !email || !phone || !password) {
      return alert("⚠️ All fields are required");
    }

    try {
      await api.post("/auth/register", {
        name,
        email,
        phone,
        password,
      });

      alert("✅ Registered successfully. Please login.");

      // ❌ DO NOT AUTO LOGIN
      // ✅ SWITCH TO LOGIN PAGE
      setShowRegister(false);

      // clear fields
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");

    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1 className="logo">💳 CredBit</h1>
        <p className="subtitle">Create your account</p>

        <input
          className="input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={register}>
          Register
        </button>

        <p className="bottom-text">
          Already have an account?{" "}
          <span
            className="clickable"
            onClick={() => setShowRegister(false)}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}