import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

export default function OtpEntry() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleOtpEntry = async (event) => {
    event.preventDefault();
    try {
      const headers = {
        "Content-Type": "application/json",
      };
  
      console.log("Sending request to verify OTP:", { otp });
      const response = await axios.post(
        `${API_BASE_URL}/forgotPassword/verifyOTP`,
        { otp },
        { headers }
      );
  
      if (response.status === 200) {
        alert("OTP entered successfully");
        navigate("/newPassword");
      } else {
        throw new Error("Failed to enter OTP");
      }
    } catch (error) {
      console.error("Error during OTP entry:", error);
      alert("OTP entry failed");
    }
  };

  return (
    <section className="container">
      <h1>OtpEntry</h1>
      <form className="form-container" onSubmit={handleOtpEntry}>
        <input
          type="text"
          value={otp}
          placeholder="Enter OTP"
          onChange={(event) => setOtp(event.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </section>
  );
}
