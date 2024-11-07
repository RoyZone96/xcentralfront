import react, {useState} from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router';

export default function UpdatePassword() {
    let navigate = useNavigate();



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
    
            const newPassword = event.target.newPassword.value;
            const confirmPassword = event.target.confirmPassword.value;
    
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
    
            const response = await axios.put(`http://localhost:8080/users/${username}/update-password`, 
                { password: newPassword }, 
                { headers }
            );
    
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
    }
    
    return (
        <div>
            <h1>Update Password</h1>
            <form>
                <div>
                    <label htmlFor="oldPassword">Old Password</label>
                    <input type="password" id="oldPassword" name="oldPassword" required />
                </div>
                <div>
                    <label htmlFor="password">New Password</label>
                    <input type="password" id="password" name="newPassword" required />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required />
                </div>
                <button type="submit" onClick={handleUpdatePassword}>Update Password</button>
            </form>
        </div>
    );

}
