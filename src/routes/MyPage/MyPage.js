import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../../config/api";
import "./MyPage.css";

export default function AccountPage() {
  const [submissions, setSubmissions] = useState([]);
  const [userName, setUserName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [lastUpdateTime, setLastUpdateTime] = useState({});
  const navigate = useNavigate();

  const BEYS_ON_PAGE = 10; // Number of submissions to display per page

  useEffect(() => {
    const loadUserSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please log in to access this page");
          navigate("/login");
          return;
        }

        // Debug: Let's examine the token
        console.log("🔍 TOKEN DEBUG INFO:");
        console.log("Raw token:", token);
        console.log("Token length:", token.length);
        console.log("Token type:", typeof token);
        
        const tokenParts = token.split(".");
        console.log("Token parts count:", tokenParts.length);
        console.log("Token parts:", tokenParts);
        
        // Check each part
        tokenParts.forEach((part, index) => {
          console.log(`Part ${index + 1}:`, part);
          console.log(`Part ${index + 1} length:`, part.length);
        });

        let decodedToken;
        let username;

        try {
          // Validate token format before decoding
          if (tokenParts.length !== 3) {
            console.error("❌ Token format invalid - expected 3 parts, got:", tokenParts.length);
            throw new Error(`Invalid token format: expected 3 parts, got ${tokenParts.length}`);
          }

          console.log("✅ Token format valid, attempting to decode...");
          decodedToken = jwtDecode(token);
          console.log("🔓 Decoded token:", decodedToken);
          
          username = decodedToken?.sub || decodedToken?.username;
          console.log("👤 Extracted username:", username);

          if (!username) {
            console.error("❌ No username found in decoded token");
            throw new Error("No username found in token");
          }
        } catch (tokenError) {
          console.error("❌ Token validation error:", tokenError);
          console.error("Token error details:", {
            message: tokenError.message,
            stack: tokenError.stack,
            token: token.substring(0, 50) + "..." // Show first 50 chars for debugging
          });
          alert("Invalid token. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          navigate("/login");
          return;
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
          `${API_BASE_URL}/submissions/sublist/username/${username}`,
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
            `${API_BASE_URL}/users/profile-picture/${username}`,
            { headers }
          );
          if (profileResponse.data) {
            // Add timestamp to prevent caching issues
            const timestampedUrl = `${profileResponse.data}?t=${Date.now()}`;
            setProfilePictureUrl(timestampedUrl);
          }
        } catch (profileError) {
          console.log(
            "No profile picture found or error loading profile picture"
          );
        }
      } catch (error) {
        console.error("Error loading user submissions:", error);

        // Handle specific error types
        if (
          error.message?.includes("Invalid token") ||
          error.response?.status === 401
        ) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          navigate("/login");
        } else {
          alert("Failed to load submissions. Please try again.");
        }
      }

      // Ensure username is set even if API calls fail
      const storedUserName = localStorage.getItem("username");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    };

    loadUserSubmissions();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.delete(`${API_BASE_URL}/submissions/id/${id}`, {
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

      // Find the current submission for validation
      const currentSubmission = submissions.find((sub) => sub.id === id);
      if (!currentSubmission) {
        alert("Submission not found");
        return;
      }

      // Rate limiting: prevent rapid updates (3 seconds)
      const now = Date.now();
      const lastUpdate = lastUpdateTime[id] || 0;
      if (now - lastUpdate < 3000) {
        alert("Please wait 3 seconds between updates");
        return;
      }

      // Check for large changes (flag suspicious activity)
      const winDiff = Math.abs(wins - currentSubmission.wins);
      const lossDiff = Math.abs(losses - currentSubmission.losses);
      let shouldFlag = false;
      let flagReason = "";

      if (winDiff > 5 || lossDiff > 5) {
        shouldFlag = true;
        flagReason = `Large change detected (+${winDiff} wins, +${lossDiff} losses)`;
        const confirm = window.confirm(
          `${flagReason}. Continue? This will be logged for review.`
        );
        if (!confirm) return;
      }

      // Flag high win rates
      const totalMatches = wins + losses;
      if (totalMatches > 10) {
        const winRate = wins / totalMatches;
        if (winRate > 0.9) {
          shouldFlag = true;
          flagReason = `High win rate detected (${(winRate * 100).toFixed(
            1
          )}%)`;
          alert(`${flagReason}. This will be flagged for admin review.`);
        }
      }

      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const updatedSubmission = { wins, losses };
      await axios.put(
        `${API_BASE_URL}/submissions/id/${id}`,
        updatedSubmission,
        { headers }
      );

      setSubmissions(
        submissions.map((submission) =>
          submission.id === id ? { ...submission, wins, losses } : submission
        )
      );

      // Update rate limiting tracker
      setLastUpdateTime((prev) => ({ ...prev, [id]: now }));

      // Flag submission if suspicious activity detected
      if (shouldFlag) {
        try {
          await axios.put(
            `${API_BASE_URL}/submissions/flag/${id}`,
            {
              reason: flagReason,
              flaggedAt: new Date().toISOString(),
              flaggedBy: userName,
              oldValues: {
                wins: currentSubmission.wins,
                losses: currentSubmission.losses,
              },
              newValues: { wins, losses },
            },
            { headers }
          );
          console.log(`Submission ${id} flagged for review: ${flagReason}`);
        } catch (flagError) {
          console.error("Error flagging submission:", flagError);
          // Don't prevent the update if flagging fails
        }
      }
    } catch (error) {
      console.error("Error updating submission:", error);
      if (error.response?.status === 401) {
        alert("Authentication failed. Please login again.");
        navigate("/login");
      } else {
        alert("Failed to update submission");
      }
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
      formData.append("file", file);

      const response = await axios.post(
        `${API_BASE_URL}/users/${userName}/profile-image`,
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        // After successful upload, fetch the updated profile picture URL
        try {
          const profileResponse = await axios.get(
            `${API_BASE_URL}/users/profile-picture/${userName}`,
            { headers }
          );
          if (profileResponse.data) {
            // Add timestamp to force browser to reload the image
            const timestampedUrl = `${profileResponse.data}?t=${Date.now()}`;
            setProfilePictureUrl(timestampedUrl);
          }
        } catch (fetchError) {
          console.error("Error fetching updated profile picture:", fetchError);
          // Still show success message even if fetch fails
        }
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
                  {userName && userName.length > 0
                    ? userName.charAt(0).toUpperCase()
                    : "?"}
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
              <h3 className="user-name">{userName || "Unknown User"}</h3>
              <p className="user-role">
                {isAdmin ? "🛡️ Administrator" : "👤 Standard Member"}
              </p>
              <p className="member-since">
                Member Since: {new Date().getFullYear()}
              </p>
              <p className="member-id">
                ID: {userName ? userName.toUpperCase() : "UNKNOWN"}
              </p>
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
      <div className="fair-play-notice">
        <small>
          <strong>🛡️ Fair Play:</strong> Updates are rate-limited and large
          changes are logged for review.
        </small>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Blade</th>
            <th>Ratchet</th>
            <th>Bit</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Win Rate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSubmissions.map((submission) => (
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
                {submission.wins + submission.losses > 0
                  ? `${(
                      (submission.wins /
                        (submission.wins + submission.losses)) *
                      100
                    ).toFixed(1)}%`
                  : "0.0%"}
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
