import React, { useState } from "react";
import { setAdminToken } from "../api";

const AdminLogin = ({ onLoggedIn }) => {
  const [token, setToken] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setAdminToken(token.trim());
    onLoggedIn();
  };

  return (
    <div className="admin-login-screen">
      <form className="admin-login-card" onSubmit={submit}>
        <h1>Loryfiar Admin</h1>
        <p>Enter the admin token to manage interviews.</p>
        <input
          type="password"
          placeholder="Admin token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          autoFocus
        />
        <button type="submit">Enter</button>
      </form>
    </div>
  );
};

export default AdminLogin;