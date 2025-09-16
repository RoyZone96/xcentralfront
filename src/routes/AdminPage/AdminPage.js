import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import UserManagement from "./UserManagement";
import PartsManagement from "./PartsManagement";
import FlaggedSubmissions from "./FlaggedSubmissions";
import "./AdminPage.css";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [flaggedCount, setFlaggedCount] = useState(0);
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
      } else {
        // Fetch flagged submissions count
        //fetchFlaggedCount();
      }
    } catch (e) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  // const fetchFlaggedCount = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const headers = { Authorization: `Bearer ${token}` };
  //     const response = await axios.get(
  //       `${API_BASE_URL}/admin/flagged-submissions/count`,
  //       { headers }
  //     );
  //     setFlaggedCount(response.data.count || 0);
  //   } catch (error) {
  //     console.error("Error fetching flagged count:", error);
  //   }
  // };

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
        <button
          className={activeTab === "flagged" ? "active" : ""}
          onClick={() => setActiveTab("flagged")}
        >
          Flagged Submissions
          {flaggedCount > 0 && (
            <span className="notification-badge">{flaggedCount}</span>
          )}
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "users" && <UserManagement />}
        {activeTab === "parts" && <PartsManagement />}
        {activeTab === "flagged" && (
          <FlaggedSubmissions
            onFlagResolved={() =>
              setFlaggedCount((prev) => Math.max(0, prev - 1))
            }
          />
        )}
      </div>
    </div>
  );
}
