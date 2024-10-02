import axios from "axios";
import bcrypt from "bcryptjs";
import "../styles/Registration.css";
import { useState, React } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export default function Registration() {
  let navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { username, email, password, confirmPassword } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.id]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      alert("Username and password cannot be empty");
      return;
    } else if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      try {
        // Check if username already exists
        const existingUser = await axios.get(`http://localhost:8080/users/username/${username}`);
        if (existingUser.status === 200) {
          alert("Username already exists");
          return;
        }
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx and is not 404
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          alert("You got problems, yo!")
          return;
        }
      }

      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userWithHashedPassword = { ...user, password: hashedPassword, role: "user" };

        await axios.post("http://localhost:8080/users/newuser", userWithHashedPassword);
        alert("User registered successfully");
        navigate("/");
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          alert("Server issue, check for status code.)")
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
          alert("Reaquest made, but not response received")
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
          alert("Some other random bullshit happened; I dunno")
        }
      }
    }
};

  return (
    <div>
      <h1>Registration</h1>
      <form onSubmit={(e) => onSubmit(e)} className="form-container">
        <div className="form-group">
         
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => onInputChange(e)}
          />
        </div>
        <div className="form-group">
      
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={email}
            onChange={(e) => onInputChange(e)}
          />
          {/* <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small> */}
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => onInputChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => onInputChange(e)}
          />
        </div>
          <Link className="to-login" to="/login">Already have an account? Login here</Link>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}