import {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';


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
          <form  className="scroll-container" onSubmit={onLogin}>
            <h1>Login</h1>
            <div className="form-group">
              <label htmlFor="username">Username</label>
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
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => onInputChange(e, setPassword)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      );
}