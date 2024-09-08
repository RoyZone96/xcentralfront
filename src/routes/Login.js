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
            alert('Login failed, username or password is incorrect');
        }   
    };

    return(
        <div className="login">
            <h2>Login</h2>
            <form onSubmit={onLogin}>
                <input type="text" placeholder="Username" onChange={(e) => onInputChange(e, setUsername)} />
                <input type="password" placeholder="Password" onChange={(e) => onInputChange(e, setPassword)} />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}