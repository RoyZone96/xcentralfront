import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode';
import LogoutButton from '../../components/Logout';
import './MyPage.css';

export default function AccountPage() {
  const [submissions, setSubmissions] = useState([]);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User is not authenticated');
        }

        const decodedToken = jwtDecode(token);
        const username = decodedToken.sub;
        if (!username) {
          throw new Error('Username not found in token');
        }

        const headers = {
          'Authorization': `Bearer ${token}`
        };

        const response = await axios.get(`http://localhost:8080/submissions/sublist/username/${username}`, { headers });
        const submissions = response.data;
        if (!Array.isArray(submissions)) {
          throw new Error('Invalid response format');
        }

        setSubmissions(submissions);
      } catch (error) {
        console.error('Error loading user submissions:', error);
        alert('Failed to load submissions');
      }

      const storedUserName = localStorage.getItem('username');
      setUserName(storedUserName);
    };

    loadUserSubmissions();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      await axios.delete(`http://localhost:8080/submissions/id/${id}`, { headers });
      setSubmissions(submissions.filter(submission => submission.id !== id));
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('Failed to delete submission');
    }
  };

  const handleUpdate = async (id, wins, losses, points) => {
    try {
      if (wins < 0 || losses < 0 || points < 0) {
        alert('Values cannot be less than zero');
        return;
      }

      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const updatedSubmission = { wins, losses, points };
      await axios.put(`http://localhost:8080/submissions/id/${id}`, updatedSubmission, { headers });
      setSubmissions(submissions.map(submission =>
        submission.id === id ? { ...submission, wins, losses, points } : submission
      ));
    } catch (error) {
      console.error('Error updating submission:', error);
      alert('Failed to update submission');
    }
  };

  const navigateToWorkshop = () => {
    navigate('/createPage');
  };

  const navigateToUpdatePassword = () => {
    navigate('/updatePassword');
  };

  const navigateToUpdateEmail = () => {
    navigate('/updateEmail');
  }

  // const handlePointsChange = (id, event) => {
  //   const increment = parseInt(event.target.value, 10);
  //   const submission = submissions.find(sub => sub.id === id);
  //   const newPoints = Math.min(submission.points + increment, 3);
  //   handleUpdate(id, submission.wins, submission.losses, newPoints);
  // };

  return (
    <div>
      <h1>Welcome, {userName}</h1>
      <div>
        <h2>Account Maintainance</h2>
         <button className='updatePassword' onClick={navigateToUpdatePassword}>Update Password</button>
         <button className='updateEmail' onClick={navigateToUpdateEmail}>Update Email</button>
         <button className='logout' onClick={LogoutButton}>Logout</button>
      </div>
     
      <button className="newcombo" onClick={navigateToWorkshop}>Create New Combo</button>

      <h2>My Submissions</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Blade</th>
            <th>Ratchet</th>
            <th>Bit</th>
            <th>Wins</th>
            <th>Losses</th>
            {/* <th>Points</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map(submission => (
            <tr key={submission.id}>
              <td>{submission.blade}</td>
              <td>{submission.ratchet}</td>
              <td>{submission.bit}</td>
              <td>
                <Form.Control
                  type="number"
                  value={submission.wins}
                  min="0"
                  onChange={(e) =>
                    handleUpdate(
                      submission.id,
                      parseInt(e.target.value, 10),
                      submission.losses,
                      submission.points
                    )
                  }
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={submission.losses}
                  min="0"
                  onChange={(e) =>
                    handleUpdate(
                      submission.id,
                      submission.wins,
                      parseInt(e.target.value, 10),
                      submission.points
                    )
                  }
                />
              </td>
              {/* <td>
                <Form.Control
                  as="select"
                  onChange={(e) => handlePointsChange(submission.id, e.target.value)}
                >
                  <option value="1">+1</option>
                  <option value="2">+2</option>
                  <option value="3">+3</option>
                </Form.Control>
              </td> */}
              <td>
                <Button variant="danger" onClick={() => handleDelete(submission.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}