import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import "./ForgotAccount.css";

const ForgotAccount = () => {
  const [email, setEmail] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/forgotPassword/verifyMail/${email}`);
      alert(response.data);
    } catch (error) {
      alert("Error resetting password");
    }
  };
  
  return (
    <div className="forgot-account">
     
      <form className="form-container" onSubmit={handleEmailSubmit}> 
        <h2>Forgot Password</h2>
        <div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>

    </div>
  );
};

export default ForgotAccount;
