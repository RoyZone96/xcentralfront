import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Form } from "react-bootstrap";
import { API_BASE_URL } from "../../config/api";
import "./MyPage.css";

export default function MyPage() {
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Safe token parsing function
  const parseJwtToken = (token) => {
    try {
      if (!token || typeof token !== 'string') {
        console.log('Invalid token provided:', token);
        return null;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('Token does not have 3 parts:', parts.length);
        return null;
      }

      const payload = parts[1];
      const decodedPayload = atob(payload);
      const parsedPayload = JSON.parse(decodedPayload);
      
      return parsedPayload;
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  };

  // Safe user info extraction
  const getUserInfoFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log('No token found in localStorage');
        return null;
      }

      const decodedToken = parseJwtToken(token);
      if (!decodedToken) {
        console.log('Failed to decode token');
        return null;
      }

      // Extract user info safely
      const userInfo = {
        userId: decodedToken.sub || decodedToken.userId || null,
        username: decodedToken.sub || decodedToken.username || 'Unknown',
        email: decodedToken.email || null
      };

      console.log('Extracted user info:', userInfo);
      return userInfo;
    } catch (error) {
      console.error('Error extracting user info from token:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user info from token
        const user = getUserInfoFromToken();
        if (!user || !user.userId) {
          setError('Invalid authentication. Please log in again.');
          setLoading(false);
          return;
        }

        setUserInfo(user);

        // Load user submissions
        const token = localStorage.getItem("token");
        if (!token) {
          setError('No authentication token found.');
          setLoading(false);
          return;
        }

        const headers = { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        console.log('Loading submissions for user:', user.userId);
        const response = await axios.get(
          `${API_BASE_URL}/submissions/user/${user.userId}`,
          { headers }
        );

        setUserSubmissions(response.data || []);
      } catch (error) {
        console.error('Error loading user submissions:', error);
        if (error.response?.status === 401) {
          setError('Authentication expired. Please log in again.');
        } else if (error.response?.status === 403) {
          setError('Access denied. Please log in again.');
        } else {
          setError('Failed to load submissions. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Safe string operations with null checks
  const safeGetFirstChar = (str) => {
    if (!str || typeof str !== 'string' || str.length === 0) {
      return '';
    }
    return str.charAt(0);
  };

  const safeCapitalize = (str) => {
    if (!str || typeof str !== 'string' || str.length === 0) {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Update submission function with proper error handling
  const updateSubmission = async (submissionId, newWins, newLosses) => {
    try {
      if (!userInfo?.userId) {
        alert('Authentication error. Please log in again.');
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert('No authentication token found. Please log in again.');
        return;
      }

      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const updateData = {
        userId: userInfo.userId,
        wins: parseInt(newWins) || 0,
        losses: parseInt(newLosses) || 0
      };

      console.log('Updating submission:', submissionId, updateData);

      await axios.put(
        `${API_BASE_URL}/submissions/${submissionId}`,
        updateData,
        { headers }
      );

      // Refresh submissions after update
      const response = await axios.get(
        `${API_BASE_URL}/submissions/user/${userInfo.userId}`,
        { headers }
      );

      setUserSubmissions(response.data || []);
      alert('Submission updated successfully!');
    } catch (error) {
      console.error('Error updating submission:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Authentication expired. Please log in again.');
      } else {
        alert('Failed to update submission. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="my-page">
        <div className="loading">Loading your submissions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-page">
        <div className="error">
          <h3>Error</h3>
          <p>{error}</p>
          <Button onClick={() => window.location.href = '/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-page">
      <div className="user-header">
        <h2>My Submissions</h2>
        {userInfo && (
          <p>Welcome, {userInfo.username || 'User'}!</p>
        )}
      </div>

      {userSubmissions.length === 0 ? (
        <div className="no-submissions">
          <h3>No submissions found</h3>
          <p>You haven't created any combo submissions yet.</p>
          <Button href="/create-combo">Create Your First Combo</Button>
        </div>
      ) : (
        <div className="submissions-table">
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
              {userSubmissions.map((submission) => (
                <tr key={submission.id || Math.random()}>
                  <td>{submission.bladeName || submission.blade || 'N/A'}</td>
                  <td>{submission.ratchetName || submission.ratchet || 'N/A'}</td>
                  <td>{submission.bitName || submission.bit || 'N/A'}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="0"
                      defaultValue={submission.wins || 0}
                      id={`wins-${submission.id}`}
                      style={{ width: '80px' }}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      min="0"
                      defaultValue={submission.losses || 0}
                      id={`losses-${submission.id}`}
                      style={{ width: '80px' }}
                    />
                  </td>
                  <td>
                    {(() => {
                      const wins = submission.wins || 0;
                      const losses = submission.losses || 0;
                      const total = wins + losses;
                      return total > 0 ? `${((wins / total) * 100).toFixed(1)}%` : '0%';
                    })()}
                  </td>
                  <td>
                    <Button
                      size="sm"
                      onClick={() => {
                        const newWins = document.getElementById(`wins-${submission.id}`)?.value;
                        const newLosses = document.getElementById(`losses-${submission.id}`)?.value;
                        updateSubmission(submission.id, newWins, newLosses);
                      }}
                    >
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}