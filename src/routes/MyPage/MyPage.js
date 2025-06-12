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
  const navigate = useNavigate();

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
        localStorage.setItem("username", username);
        setUserName(username);
        console.log("Username:", username);
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(
          `http://localhost:8080/submissions/sublist/username/${username}`,
          { headers }
        );
        const submissions = response.data;
        if (!Array.isArray(submissions)) {
          throw new Error("Invalid response format");
        }

        setSubmissions(submissions);
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

  const navigateToWorkshop = () => {
    navigate("/createPage");
  };

  const navigateToUpdatePassword = () => {
    navigate("/updatePassword");
  };

  const navigateToUpdateEmail = () => {
    navigate("/updateEmail");
  };

  return (
    <div>
      <h1>Welcome, {userName}</h1>
      <div className="account-actions">
        <div className="update-buttons">
          <button className="update-btn" onClick={navigateToUpdatePassword}>
            Update Password
          </button>
          <button className="update-btn" onClick={navigateToUpdateEmail}>
            Update Email
          </button>
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
    </div>
  );
}
