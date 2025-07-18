import axios from "axios";
import bcrypt from "bcryptjs";
import "./Registration.css";
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

    // Enhanced front-end validation
    if (username.trim() === "") {
      alert("Username is required. Please enter a username.");
      return;
    }

    if (username.length < 3) {
      alert("Username must be at least 3 characters long.");
      return;
    }

    if (email.trim() === "") {
      alert("Email address is required. Please enter your email.");
      return;
    }

    if (password === "") {
      alert("Password is required. Please enter a password.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      alert(
        "Passwords do not match. Please make sure both password fields are identical."
      );
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address (e.g., user@example.com).");
      return;
    }

    // Username format validation
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      alert("Username can only contain letters, numbers, and underscores.");
      return;
    }

    try {
      // Check if username already exists
      const existingUser = await axios.get(
        `http://localhost:8080/users/username/${username}`
      );
      if (existingUser.status === 200) {
        alert("Username already exists. Please choose a different username.");
        return;
      }
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx and is not 404
        const status = error.response.status;
        const errorMessage =
          error.response.data?.message ||
          error.response.data ||
          "Unknown server error";

        if (status === 400) {
          alert(
            `Bad Request: ${errorMessage}. Please check your username format.`
          );
        } else if (status === 500) {
          alert(`Server Error: ${errorMessage}. Please try again later.`);
        } else if (status === 503) {
          alert(
            "Service temporarily unavailable. Please try again in a few minutes."
          );
        } else {
          alert(`Server Error (${status}): ${errorMessage}`);
        }
        return;
      }
    }

    try {
      // Check if email already exists
      const existingEmail = await axios.get(
        `http://localhost:8080/users/email/${email}`
      );
      if (existingEmail.status === 200) {
        alert(
          "Email address already exists. Please use a different email address."
        );
        return;
      }
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx and is not 404
        const status = error.response.status;
        const errorMessage =
          error.response.data?.message ||
          error.response.data ||
          "Unknown server error";

        if (status === 400) {
          alert(
            `Bad Request: ${errorMessage}. Please check your email format.`
          );
        } else if (status === 500) {
          alert(`Server Error: ${errorMessage}. Please try again later.`);
        } else if (status === 503) {
          alert(
            "Service temporarily unavailable. Please try again in a few minutes."
          );
        } else {
          alert(`Server Error (${status}): ${errorMessage}`);
        }
        return;
      }
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const userWithHashedPassword = {
        ...user,
        password: hashedPassword,
        role: "user",
      };

      await axios.post(
        "http://localhost:8080/users/newuser",
        userWithHashedPassword
      );
      alert(
        "User registered successfully! Please check your email to confirm your account."
      );
      navigate("/");
    } catch (error) {
      // Simplified error logging for debugging
      console.error("Registration error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const status = error.response.status;
        const errorData = error.response.data;
        const errorMessage =
          errorData?.message || errorData || "Unknown error occurred";

        if (status === 400) {
          if (errorMessage.toLowerCase().includes("username")) {
            alert(
              "Invalid username. Username may already exist or contain invalid characters."
            );
          } else if (errorMessage.toLowerCase().includes("email")) {
            alert(
              "Invalid email address. Email may already exist or have an invalid format."
            );
          } else if (errorMessage.toLowerCase().includes("password")) {
            alert(
              "Invalid password. Password may not meet security requirements."
            );
          } else {
            alert(`Registration failed: ${errorMessage}`);
          }
        } else if (status === 404) {
          alert(
            "Registration endpoint not found. Please make sure the backend server is running and configured correctly."
          );
        } else if (status === 409) {
          // Conflict - usually means duplicate data
          if (errorMessage.toLowerCase().includes("username")) {
            alert(
              "Username already exists. Please choose a different username."
            );
          } else if (errorMessage.toLowerCase().includes("email")) {
            alert(
              "Email address already exists. Please use a different email address."
            );
          } else {
            alert(
              "Account with this username or email already exists. Please use different credentials."
            );
          }
        } else if (status === 422) {
          alert(
            `Validation error: ${errorMessage}. Please check all fields and try again.`
          );
        } else if (status === 500) {
          alert(
            "Server error occurred during registration. Please try again later."
          );
        } else if (status === 503) {
          alert(
            "Registration service is temporarily unavailable. Please try again in a few minutes."
          );
        } else {
          alert(`Registration failed (Error ${status}): ${errorMessage}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
          alert(
            "Cannot connect to server. Please make sure the backend server is running on port 8080."
          );
        } else {
          alert(
            "Network error: Could not connect to the server. Please check your internet connection and try again."
          );
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        alert(`Registration failed: ${error.message}. Please try again.`);
      }
    }
  };

  return (
    <div className="container">
      <form onSubmit={(e) => onSubmit(e)} className="form-container">
        <h1>Registration</h1>
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
        <Link className="to-login" to="/login">
          Already have an account? Login here
        </Link>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
