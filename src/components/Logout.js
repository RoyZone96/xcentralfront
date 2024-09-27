import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
        window.location.reload();
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}