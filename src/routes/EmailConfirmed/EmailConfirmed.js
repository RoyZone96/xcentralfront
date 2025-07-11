import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./EmailConfirmed.css";

export default function EmailConfirmed() {
  const [verificationStatus, setVerificationStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token from URL query parameters
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get("token");

        if (!token) {
          setVerificationStatus("error");
          setMessage("Invalid verification link - no token provided.");
          return;
        }

        // Call your backend verification endpoint
        const response = await axios.get(`/api/verify?token=${token}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        setVerificationStatus("success");
        setMessage(
          "Your email has been successfully verified. Your account is now active and ready to use."
        );
      } catch (error) {
        setVerificationStatus("error");
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setMessage(error.response.data.message);
        } else {
          setMessage(
            "An error occurred during verification. Please try again later."
          );
        }
      }
    };

    verifyEmail();
  }, [location]);

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <>
            <h1>Verifying Email...</h1>
            <p>Please wait while we verify your email address.</p>
          </>
        );
      case "success":
        return (
          <>
            <h1>Email Confirmed!</h1>
            <p>{message}</p>
            <Link className="login-link" to="/login">
              Go to Login
            </Link>
          </>
        );
      case "error":
        return (
          <>
            <h1>Verification Failed</h1>
            <p>{message}</p>
            <Link className="login-link" to="/login">
              Try Logging In
            </Link>
          </>
        );
      default:
        return null;
    }
  };

  return <div className="email-confirmed-container">{renderContent()}</div>;
}
