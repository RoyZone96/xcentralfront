import React, { useState } from "react";
import axios from "axios";
import "./ForgotAccount.css";

const ForgotAccount = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/forgotPassword/verifyEmail/${ email }`);
      setMessage(response.data);
    } catch (error) {
      setMessage("Error resetting password");
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
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotAccount;
