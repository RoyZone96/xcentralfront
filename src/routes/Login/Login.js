import { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const user = { username, password };
      const response = await axios.post(
        `${API_BASE_URL}/users/authenticate`,
        user
      );
      
      // Debug: Let's see what the backend returns
      console.log("🔍 LOGIN RESPONSE DEBUG:");
      console.log("Full response.data:", response.data);
      console.log("Response.data type:", typeof response.data);
      console.log("Response.data keys:", Object.keys(response.data || {}));
      
      // Extract token correctly based on backend response structure
      let token;
      if (typeof response.data === 'string') {
        // Backend returns token directly as string
        token = response.data;
      } else if (response.data?.token) {
        // Backend returns object with token property
        token = response.data.token;
      } else if (response.data?.jwt) {
        // Backend returns object with jwt property
        token = response.data.jwt;
      } else if (response.data?.accessToken) {
        // Backend returns object with accessToken property
        token = response.data.accessToken;
      } else {
        throw new Error("No valid token found in response");
      }
      
      console.log("✅ Extracted token:", token);
      console.log("Token type:", typeof token);
      console.log("Token length:", token?.length);
      
      if (!token || typeof token !== 'string') {
        throw new Error("Invalid token format received from server");
      }
      
      localStorage.setItem("token", token);
      // Dispatch custom event to update navigation
      window.dispatchEvent(new Event('tokenChanged'));
      console.log(token);
      alert("Login successful");
      navigate("/myPage");
      window.location.reload();
    } catch (error) {
      console.error("Error during login:", error);

      // Check if the error response contains information about disabled account
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || error.response.data;
        const errorString = String(errorMessage || "").toLowerCase();

        // Check for disabled account messages
        if (
          errorString.includes("disabled") ||
          errorString.includes("not enabled") ||
          errorString.includes("account not activated") ||
          error.response.status === 403
        ) {
          alert(
            "Your account is disabled. Please check your email and verify your account before logging in."
          );
        } else {
          alert(
            errorMessage || "Login failed, username or password is incorrect"
          );
        }
      } else {
        alert("Login failed, username or password is incorrect");
      }
    }
  };

  return (
    <section className="container">
      <form className="form-container" onSubmit={onLogin}>
        <h1>Login</h1>
        <div>
          <input
            type="text"
            id="username"
            placeholder="Username"
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
            placeholder="Password"
            value={password}
            onChange={(e) => onInputChange(e, setPassword)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <div className="links">
          <span>
            <Link to="/registration">Register</Link> |{" "}
            <Link to="/forgotAccount">Forgot password?</Link>
          </span>
        </div>
      </form>
    </section>
  );
}
