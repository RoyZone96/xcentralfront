import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleNewPassword = async (event) => {
    event.preventDefault();
    try {
      const headers = {
        "Content-Type": "application/json",
      };
  
      const payload = {
        password: password,
        confirmPassword: confirmPassword,
      };
  
      console.log("Sending request to update password:", payload);
      const response = await axios.put(
        `http://localhost:8080/forgotPassword/resetPassword`,
        payload,
        { headers }
      );
  
      if (response.status === 200) {
        alert("Password updated successfully");
        navigate("/login");
      } else {
        throw new Error("Failed to update password");
      }
    } catch (error) {
      console.error("Error during password update:", error);
      alert("Password update failed");
    }
  };
  return (
    <section className="container">
      <h1>NewPassword</h1>
      <form className="form-container" onSubmit={handleNewPassword}>
        <input
          type="password"
          value={password}
          placeholder="New Password"
          onChange={(event) => setPassword(event.target.value)}
        />

        <input
          type="password"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </section>
  );
}
