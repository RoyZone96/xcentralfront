import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchUsername, setSearchUsername] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Fetch users for the table
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/users/userlist`);
      setUsers(response.data || []);
      console.log("Users data:", response.data);
      const totalUsers = response.data.length;
      const usersPerPage = 10;
      setTotalPages(Math.ceil(totalUsers / usersPerPage));
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  const handleBanToggle = async (username, shouldBan) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/users/${username}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchUsers(currentPage);
      // The backend returns a message, we can use it or create our own
      alert(response.data || `User ${username} status has been toggled!`);
    } catch (error) {
      console.error("Error toggling user status:", error);
      alert("Failed to toggle user status");
    }
  };

  const handleAdminToggle = async (userId, username) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/${userId}/toggleAdmin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchUsers(currentPage);
      alert(response.data || `User ${username} admin status has been toggled!`);
    } catch (error) {
      console.error("Error toggling admin status:", error);
      alert("Failed to toggle admin status");
    }
  };

  const searchUser = async () => {
    if (!searchUsername.trim()) return;

    setIsSearching(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/username/${searchUsername.trim()}`
      );
      if (response.data) {
        setUsers([response.data]);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error searching user:", error);
      if (error.response?.status === 404) {
        alert("User not found");
      } else {
        alert("Error searching for user");
      }
      setUsers([]);
      setTotalPages(1);
    }
    setIsSearching(false);
  };

  const clearSearch = () => {
    setSearchUsername("");
    setIsSearching(false);
    fetchUsers(1);
  };

  // Helper function to check if user is admin
  const isAdmin = (user) => {
    // Handle single role property (from backend: user.getRole())
    if (user.role) {
      return (
        user.role === "ADMIN" ||
        user.role === "ROLE_ADMIN" ||
        user.role.toUpperCase() === "ADMIN"
      );
    }

    // Handle roles array (legacy format)
    if (user.roles) {
      if (Array.isArray(user.roles)) {
        return user.roles.some(
          (role) =>
            role === "ADMIN" ||
            role === "ROLE_ADMIN" ||
            role.toUpperCase() === "ADMIN"
        );
      }

      // Handle string roles
      if (typeof user.roles === "string") {
        return (
          user.roles === "ADMIN" ||
          user.roles === "ROLE_ADMIN" ||
          user.roles.toUpperCase() === "ADMIN"
        );
      }
    }

    return false;
  };

  // Client-side pagination
  const usersPerPage = 10;
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  return (
    <div className="users-tab">
      <h2>User Management</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && searchUser()}
        />
        <button onClick={searchUser} disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </button>
        <button
          onClick={clearSearch}
          disabled={!searchUsername && !isSearching}
        >
          Show All
        </button>
      </div>
      {loading || isSearching ? (
        <p className="loading">Loading...</p>
      ) : users.length === 0 ? (
        <p className="no-results">No users found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`role-badge ${isAdmin(user) ? "admin" : "user"}`}
                  >
                    {isAdmin(user) ? "Admin" : "User"}
                  </span>
                  {/* Debug info - remove this later */}
                  <div style={{ fontSize: "0.7em", color: "#666" }}>
                    role: {JSON.stringify(user.role)} | roles:{" "}
                    {JSON.stringify(user.roles)}
                  </div>
                </td>
                <td>
                  <span
                    className={`status ${
                      user.enabled ? "enabled" : "disabled"
                    }`}
                  >
                    {user.enabled ? "Active" : "Banned"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() =>
                        handleBanToggle(user.username, user.enabled)
                      }
                      className={`action-button ${
                        user.enabled ? "ban" : "unban"
                      }`}
                    >
                      {user.enabled ? "Ban" : "Unban"}
                    </button>

                    {isAdmin(user) ? (
                      <button
                        onClick={() =>
                          handleAdminToggle(user.id, user.username)
                        }
                        className="action-button demote"
                      >
                        Demote
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleAdminToggle(user.id, user.username)
                        }
                        className="action-button promote"
                      >
                        Promote
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
