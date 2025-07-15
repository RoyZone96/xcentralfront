import React, { useState, useEffect } from "react";
import axios from "axios";

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
      const response = await axios.get(`http://localhost:8080/users/userlist`);
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
      const endpoint = shouldBan ? "ban" : "unban";
      await axios.put(`http://localhost:8080/users/${username}/${endpoint}`);
      fetchUsers(currentPage);
      alert(`User ${username} has been ${shouldBan ? "banned" : "unbanned"}!`);
    } catch (error) {
      console.error(
        `Error ${shouldBan ? "banning" : "unbanning"} user:`,
        error
      );
      alert(`Failed to ${shouldBan ? "ban" : "unban"} user`);
    }
  };

  const handleAdminToggle = async (username, shouldPromote) => {
    try {
      const endpoint = shouldPromote ? "promote" : "demote";
      await axios.put(`http://localhost:8080/users/${username}/${endpoint}`);
      fetchUsers(currentPage);
      alert(
        `User ${username} has been ${
          shouldPromote ? "promoted to admin" : "demoted from admin"
        }!`
      );
    } catch (error) {
      console.error(
        `Error ${shouldPromote ? "promoting" : "demoting"} user:`,
        error
      );
      alert(`Failed to ${shouldPromote ? "promote" : "demote"} user`);
    }
  };

  const searchUser = async () => {
    if (!searchUsername.trim()) return;

    setIsSearching(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/users/username/${searchUsername.trim()}`
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
                    className={`role-badge ${
                      user.roles && user.roles.includes("ADMIN")
                        ? "admin"
                        : "user"
                    }`}
                  >
                    {user.roles && user.roles.includes("ADMIN")
                      ? "Admin"
                      : "User"}
                  </span>
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

                    {user.roles && user.roles.includes("ADMIN") ? (
                      <button
                        onClick={() => handleAdminToggle(user.username, false)}
                        className="action-button demote"
                      >
                        Demote
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAdminToggle(user.username, true)}
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
