import { useState } from 'react';
import "./Login.css";
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onInputChange = (e, setter) => {
        setter(e.target.value);
    }

    const onLogin = async (e) => {
        e.preventDefault();
        try {
            const user = { username, password };
            const response = await axios.post("http://localhost:8080/users/authenticate", user);
            const token = response.data;
            localStorage.setItem('token', token);
            console.log(token);
            alert('Login successful');
            navigate('/myPage');
            window.location.reload();
        } catch (error) {
            console.error('Error during login:', error);
            alert('Login failed, username or password is incorrect');
        }
    };

    return (
        <div className='container'>
            <form className="form-container" onSubmit={onLogin}>
                <h1>Login</h1>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => onInputChange(e, setUsername)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => onInputChange(e, setPassword)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                <Link to="/register">Register</Link>
            </form>
        </div>
    );
}