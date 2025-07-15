import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import UserManagement from "./UserManagement";
import PartsManagement from "./PartsManagement";
import "./AdminPage.css";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const navigate = useNavigate();

  // Admin authentication/authorization check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      let userRoles =
        decoded.roles || decoded.authorities || decoded.role || [];
      if (typeof userRoles === "string") userRoles = [userRoles];
      const adminStatus = userRoles
        .map((r) => r.toUpperCase())
        .some((r) => r === "ADMIN" || r === "ROLE_ADMIN");
      setIsAdmin(adminStatus);
      setCheckedAuth(true);
      if (!adminStatus) {
        alert("You are not authorized to view this page.");
        navigate("/login");
      }
    } catch (e) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  if (!checkedAuth) return null;
  if (!isAdmin) return null;

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <div className="admin-tabs">
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={activeTab === "parts" ? "active" : ""}
          onClick={() => setActiveTab("parts")}
        >
          Parts
        </button>
      </div>

      {activeTab === "users" && <UserManagement />}
      {activeTab === "parts" && <PartsManagement />}
    </div>
  );
}
