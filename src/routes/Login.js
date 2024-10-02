import {useState} from 'react';
import "../styles/Login.css";
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
        try{ 
            const user = {username, password};
            const response = await axios.post("http://localhost:8080/users/authenticate", user);
            const token = response.data;
            localStorage.setItem('token', token);
            console.log(token);
            navigate('/');
            alert('Login successful');
            window.location.reload();
        }
        catch(error){
            console.error('Error during login:', error);
            alert('Login failed, username or password is incorrect');
        }   
    };

    return (
        <div>
          <form  className="form-container" onSubmit={onLogin}>
            <h1>Login</h1>
            <div className="form-group">
              
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => onInputChange(e, setUsername)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => onInputChange(e, setPassword)}
              />
            </div>
            <Link className="to-register" to="/registration">Don't have an account? Register here</Link>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      );
}