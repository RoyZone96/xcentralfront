import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleUpdatePassword = async (event) => {
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

      if (!newPassword) {
        throw new Error('New password is required');
      }

      if (newPassword !== confirmPassword) {
        alert('New password and confirm password do not match');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const payload = { 
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword};

      console.log('Sending request to update password:', payload);

      const response = await axios.put(`http://localhost:8080/users/${username}/update-password`, payload, { headers });

      if (response.status === 200) {
        alert('Password updated successfully');
        navigate('/myPage');
      } else {
        throw new Error('Failed to update password');
      }
    } catch (error) {
      console.error('Error during update password:', error);
      alert('Update password failed');
    }
  };

  return (
    <div>
      <h1>Update Password</h1>
      <form className="form-container" onSubmit={handleUpdatePassword}>
        <div>
          <input 
            type="password" 
            id="oldPassword" 
            name="oldPassword" 
            placeholder='Old Password' 
            required 
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div>
          <input 
            type="password" 
            id="password" 
            name="newPassword" 
            placeholder='New Password' 
            required 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword" 
            placeholder='Confirm Password' 
            required 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default UpdatePassword;