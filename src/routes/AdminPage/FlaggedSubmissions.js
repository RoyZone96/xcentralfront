import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import axios from "axios";

export default function FlaggedSubmissions({ onFlagResolved }) {
  const [flaggedSubmissions, setFlaggedSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState("dateUpdated");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchFlaggedSubmissions();
  }, []);

  const fetchFlaggedSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(
        "http://localhost:8080/submissions/flagged",
        { headers }
      );

      console.log("Flagged submissions response:", response.data);
      setFlaggedSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching flagged submissions:", error);
      alert("Failed to load flagged submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveFlag = async (submissionId, action) => {
    // Confirm the action with the admin
    const actionText =
      action === "approved"
        ? "accept these changes"
        : "reject and resolve this flag";
    const confirmMessage = `Are you sure you want to ${actionText}? This action cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Both approved and rejected submissions use the same resolve endpoint
      // The backend will unflag the submission regardless of admin decision
   await axios.put(`http://localhost:8080/admin/submissions/${submissionId}/resolve`, { action }, { headers });
      // Remove from list after resolving
      setFlaggedSubmissions((prev) =>
        prev.filter((submission) => submission.id !== submissionId)
      );

      // Update parent component's count
      if (onFlagResolved) onFlagResolved();

      setShowModal(false);
      alert(
        `Submission ${
          action === "approved" ? "approved" : "rejected"
        } and resolved successfully`
      );
    } catch (error) {
      console.error("Error resolving flag:", error);
      alert("Failed to resolve flag");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const sortedSubmissions = [...flaggedSubmissions].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "user":
        aValue = (a.username || a.flaggedBy || "").toLowerCase();
        bValue = (b.username || b.flaggedBy || "").toLowerCase();
        break;
      case "dateUpdated":
        aValue = new Date(a.dateUpdated || a.flaggedAt || 0);
        bValue = new Date(b.dateUpdated || b.flaggedAt || 0);
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  if (loading) {
    return <div className="loading">Loading flagged submissions...</div>;
  }

  return (
    <div className="flagged-submissions">
      <h3>Flagged Submissions ({flaggedSubmissions.length})</h3>

      {flaggedSubmissions.length === 0 ? (
        <div className="no-flags">
          <p>🎉 No flagged submissions found!</p>
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th
                onClick={() => handleSort("user")}
                style={{ cursor: "pointer" }}
              >
                User {sortBy === "user" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th>Combo</th>
              <th>Old Values</th>
              <th>New Values</th>
              <th
                onClick={() => handleSort("dateUpdated")}
                style={{ cursor: "pointer" }}
              >
                Date Updated{" "}
                {sortBy === "dateUpdated" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedSubmissions.map((submission) => (
              <tr key={submission.id}>
                <td>
                  {submission.username || submission.flaggedBy || "Unknown"}
                </td>
                <td>
                  {submission.bladeName || submission.blade || "N/A"} /{" "}
                  {submission.ratchetName || submission.ratchet || "N/A"} /{" "}
                  {submission.bitName || submission.bit || "N/A"}
                </td>
                <td>
                  W: {submission.oldWins || submission.oldValues?.wins || 0} /
                  L: {submission.oldLosses || submission.oldValues?.losses || 0}
                </td>
                <td>
                  W: {submission.wins || submission.newValues?.wins || 0} / L:{" "}
                  {submission.losses || submission.newValues?.losses || 0}
                </td>
                <td>
                  {submission.dateUpdated
                    ? formatDate(submission.dateUpdated)
                    : submission.flaggedAt
                    ? formatDate(submission.flaggedAt)
                    : "Unknown"}
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setShowModal(true);
                    }}
                  >
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Review Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        backdrop="static"
        className="flagged-modal"
        style={{
          zIndex: 10000,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Modal.Header>
          <Modal.Title>Review Flagged Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSubmission && (
            <div className="review-details">
              <h5>Submission Details</h5>
              <p>
                <strong>User:</strong>{" "}
                {selectedSubmission.username ||
                  selectedSubmission.flaggedBy ||
                  "Unknown"}
              </p>
              <p>
                <strong>Combo:</strong>{" "}
                {selectedSubmission.bladeName ||
                  selectedSubmission.blade ||
                  "N/A"}{" "}
                /{" "}
                {selectedSubmission.ratchetName ||
                  selectedSubmission.ratchet ||
                  "N/A"}{" "}
                /{" "}
                {selectedSubmission.bitName || selectedSubmission.bit || "N/A"}
              </p>
              <p>
                <strong>Date Updated:</strong>{" "}
                {selectedSubmission.dateUpdated
                  ? formatDate(selectedSubmission.dateUpdated)
                  : selectedSubmission.flaggedAt
                  ? formatDate(selectedSubmission.flaggedAt)
                  : "Unknown"}
              </p>

              <hr />

              <h5>Value Changes</h5>
              <div className="value-comparison">
                <div className="old-values">
                  <h6>Before:</h6>
                  <p>
                    Wins:{" "}
                    {selectedSubmission.oldWins ||
                      selectedSubmission.oldValues?.wins ||
                      0}
                  </p>
                  <p>
                    Losses:{" "}
                    {selectedSubmission.oldLosses ||
                      selectedSubmission.oldValues?.losses ||
                      0}
                  </p>
                </div>
                <div className="new-values">
                  <h6>After:</h6>
                  <p>
                    Wins:{" "}
                    {selectedSubmission.wins ||
                      selectedSubmission.newValues?.wins ||
                      0}
                  </p>
                  <p>
                    Losses:{" "}
                    {selectedSubmission.losses ||
                      selectedSubmission.newValues?.losses ||
                      0}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer-inline">
          <div className="modal-button-group">
            <Button
              variant="success"
              onClick={() =>
                handleResolveFlag(selectedSubmission.id, "approved")
              }
            >
              Accept
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                handleResolveFlag(selectedSubmission.id, "rejected")
              }
            >
              Reject
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
