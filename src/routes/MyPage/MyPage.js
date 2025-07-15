import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import LogoutButton from "../../components/Logout/Logout";
import "./MyPage.css";

export default function AccountPage() {
  const [submissions, setSubmissions] = useState([]);
  const [userName, setUserName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const navigate = useNavigate();

  const BEYS_ON_PAGE = 10; // Number of submissions to display per page

  useEffect(() => {
    const loadUserSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User is not authenticated");
        }

        const decodedToken = jwtDecode(token);
        const username = decodedToken.sub;
        if (!username) {
          throw new Error("Username not found in token");
        }

        // Check if user is admin from token (robust for array or string)
        console.log("Decoded JWT token:", decodedToken);
        let userRoles =
          decodedToken.roles ||
          decodedToken.authorities ||
          decodedToken.role ||
          [];
        if (typeof userRoles === "string") {
          userRoles = [userRoles];
        }
        const adminStatus = userRoles
          .map((r) => r.toUpperCase())
          .some((r) => r === "ADMIN" || r === "ROLE_ADMIN");
        setIsAdmin(adminStatus);

        localStorage.setItem("username", username);
        setUserName(username);
        console.log("Username:", username);
        console.log("Is Admin:", adminStatus);

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Load user submissions
        const response = await axios.get(
          `http://localhost:8080/submissions/sublist/username/${username}`,
          { headers }
        );
        const submissions = response.data;
        if (!Array.isArray(submissions)) {
          throw new Error("Invalid response format");
        }

        setSubmissions(submissions);

        // Load profile picture if exists
        try {
          const profileResponse = await axios.get(
            `http://localhost:8080/users/profile-picture/${username}`,
            { headers }
          );
          if (profileResponse.data) {
            setProfilePictureUrl(profileResponse.data);
          }
        } catch (profileError) {
          console.log(
            "No profile picture found or error loading profile picture"
          );
        }
      } catch (error) {
        console.error("Error loading user submissions:", error);
        alert("Failed to load submissions");
      }

      const storedUserName = localStorage.getItem("username");
      setUserName(storedUserName);
    };

    loadUserSubmissions();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.delete(`http://localhost:8080/submissions/id/${id}`, {
        headers,
      });
      setSubmissions(submissions.filter((submission) => submission.id !== id));
    } catch (error) {
      console.error("Error deleting submission:", error);
      alert("Failed to delete submission");
    }
  };

  const handleUpdate = async (id, wins, losses) => {
    try {
      if (wins < 0 || losses < 0) {
        alert("Values cannot be less than zero");
        return;
      }

      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const updatedSubmission = { wins, losses };
      await axios.put(
        `http://localhost:8080/submissions/id/${id}`,
        updatedSubmission,
        { headers }
      );
      setSubmissions(
        submissions.map((submission) =>
          submission.id === id ? { ...submission, wins, losses } : submission
        )
      );
    } catch (error) {
      console.error("Error updating submission:", error);
      alert("Failed to update submission");
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await axios.post(
        `http://localhost:8080/users/${userName}/profile-image/`,
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        setProfilePictureUrl(response.data);
        alert("Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture");
    }
  };

  const navigateToWorkshop = () => {
    navigate("/createPage");
  };

  const navigateToUpdatePassword = () => {
    navigate("/updatePassword");
  };

  const navigateToUpdateEmail = () => {
    navigate("/updateEmail");
  };

  const totalPages = Math.ceil(submissions.length / BEYS_ON_PAGE);
  const paginatedSubmissions = submissions.slice(
    (currentPage - 1) * BEYS_ON_PAGE,
    currentPage * BEYS_ON_PAGE
  );

  return (
    <div>
      {/* ID Card Section */}
      <div className="id-card">
        <div className="id-card-header">
          <h2>X CENTRAL</h2>
          <span className={`membership-badge ${isAdmin ? "admin-badge" : ""}`}>
            {isAdmin ? "ADMIN" : "MEMBER"}
          </span>
        </div>
        <div className="id-card-content">
          <div className="user-info">
            <div
              className="user-avatar"
              onClick={() => document.getElementById("profile-upload").click()}
            >
              {profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <span className="avatar-initial">
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="upload-overlay">
                <span>📷</span>
              </div>
            </div>
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              style={{ display: "none" }}
            />
            <div className="user-details">
              <h3 className="user-name">{userName}</h3>
              <p className="user-role">
                {isAdmin ? "🛡️ Administrator" : "👤 Standard Member"}
              </p>
              <p className="member-since">
                Member Since: {new Date().getFullYear()}
              </p>
              <p className="member-id">ID: {userName.toUpperCase()}</p>
            </div>
          </div>
          <div className="card-actions">
            <button className="card-btn" onClick={navigateToUpdatePassword}>
              Update Password
            </button>
            <button className="card-btn" onClick={navigateToUpdateEmail}>
              Update Email
            </button>
            {isAdmin && (
              <button
                className="card-btn admin-btn"
                onClick={() => navigate("/adminPage")}
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>
      </div>
      <h2>Workshop</h2>
      <button className="newcombo" onClick={navigateToWorkshop}>
        Create New Combo
      </button>

      <h2>My Submissions</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Blade</th>
            <th>Ratchet</th>
            <th>Bit</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id}>
              <td>{submission.blade}</td>
              <td>{submission.ratchet}</td>
              <td>{submission.bit}</td>
              <td>
                <Form.Control
                  className="input-field"
                  type="number"
                  value={submission.wins}
                  min="0"
                  onChange={(e) =>
                    handleUpdate(
                      submission.id,
                      parseInt(e.target.value, 10),
                      submission.losses
                    )
                  }
                />
              </td>
              <td>
                <Form.Control
                  className="input-field"
                  type="number"
                  value={submission.losses}
                  min="0"
                  onChange={(e) =>
                    handleUpdate(
                      submission.id,
                      submission.wins,
                      parseInt(e.target.value, 10)
                    )
                  }
                />
              </td>
              <td>
                <Button
                  variant="danger"
                  children="Delete"
                  className="delete-button"
                  onClick={() => handleDelete(submission.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
