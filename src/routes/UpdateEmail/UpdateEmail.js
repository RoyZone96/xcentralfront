import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { API_BASE_URL } from "../../config/api";

const UpdateEmail = () => {
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const navigate = useNavigate();

  const handleUpdateEmail = async (event) => {
    event.preventDefault();

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

      if (!newEmail) {
        throw new Error('New email is required');
      }

      if (newEmail !== confirmEmail) {
        alert('New email and confirm email do not match');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const payload = { 
        newEmail: newEmail,
        confirmEmail: confirmEmail
      };

      console.log('Sending request to update email:', payload);

      const response = await axios.put(`${API_BASE_URL}/users/${username}/update-email`, payload, { headers });

      if (response.status === 200) {
        alert('Email updated successfully');
        navigate('/myPage');
      } else {
        throw new Error('Failed to update email');
      }
    } catch (error) {
      console.error('Error during update email:', error);
      alert('Update email failed');
    }
  };

  return (
    <div>
      <h1>Update Email</h1>
      <form className="form-container" onSubmit={handleUpdateEmail}>
        <div>
          <input 
            type="email" 
            id="newEmail" 
            name="newEmail" 
            placeholder='New Email' 
            required 
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>
        <div>
          <input 
            type="email" 
            id="confirmEmail" 
            name="confirmEmail" 
            placeholder='Confirm Email' 
            required 
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
          />
        </div>
        <button type="submit">Update Email</button>
      </form>
    </div>
  );
};

export default UpdateEmail;