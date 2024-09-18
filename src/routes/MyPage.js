import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';


export default function AccountPage (){
  const [submissions, setSubmissions] = useState([]);
    const navigate = useNavigate();

  
  useEffect(() => {
    const loadUserSubmissions = async () => {
        try {
            // Get the token from local storage
            const token = localStorage.getItem('token');
            
            // Check if token exists
            if (!token) {
                throw new Error('User is not authenticated');
            }

            // Decode the token to get the user_id
            const decodedToken = jwtDecode(token);
            console.log('Decoded Token:', decodedToken); // Log the decoded token to inspect its structure
            const userId = decodedToken.id; // Assuming the token contains the user ID in the 'id' field

            if (!userId) {
                throw new Error('User ID not found in token');
            }

            // Set up the headers with the token
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            // Make the API call to fetch submissions
            const response = await axios.get(`http://localhost:8080/submissions/sublist/user_id/${userId}`, { headers });

            // Handle the response
            const submissions = response.data;
            console.log('User submissions:', submissions);

            // Verify that the submissions belong to the user
            if (!Array.isArray(submissions)) {
                throw new Error('Invalid response format');
            }

            // Update the state with the submissions
            setSubmissions(submissions);
        } catch (error) {
            console.error('Error loading user submissions:', error);
            alert('Failed to load submissions');
        }
    };

    loadUserSubmissions();
}, []);


const handleDelete = async (id) => {
  try {
      const token = localStorage.getItem('token');
      const headers = {
          'Authorization': `Bearer ${token}`
      };

      await axios.delete(`http://localhost:8080/submissions/${id}`, { headers });
      setSubmissions(submissions.filter(submission => submission.id !== id));
  } catch (error) {
      console.error('Error deleting submission:', error);
      alert('Failed to delete submission');
  }
};

const handleUpdate = async (id, wins, losses) => {
  try {
      const token = localStorage.getItem('token');
      const headers = {
          'Authorization': `Bearer ${token}`
      };

      const updatedSubmission = { wins, losses };
      await axios.put(`http://localhost:8080/submissions/${id}`, updatedSubmission, { headers });
      setSubmissions(submissions.map(submission => 
          submission.id === id ? { ...submission, wins, losses } : submission
      ));
  } catch (error) {
      console.error('Error updating submission:', error);
      alert('Failed to update submission');
  }
};

const navigateToWorkshop = () => {
    navigate('/createPage');
  };
  
  return (
    <div>
      <button onClick={navigateToWorkshop}>Creat New Combo</button>
      <h2>My Submissions</h2>
      <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Blade</th>
                        <th>Ratchet</th>
                        <th>Bit</th>
                        <th>Wins</th>
                        <th>Losses</th>
                        <th></th>
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
                                    onChange={(e) => handleUpdate(submission.id, e.target.value, submission.losses)} 
                                />
                            </td>
                            <td>
                                <Form.Control 
                                    type="number" 
                                    value={submission.losses} 
                                    onChange={(e) => handleUpdate(submission.id, submission.wins, e.target.value)} 
                                />
                            </td>
                            <td>
                                <Button variant="danger" onClick={() => handleDelete(submission.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
    </div>
  );
};