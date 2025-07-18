import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./EmailConfirmed.css";

export default function EmailConfirmed() {
  const [verificationStatus, setVerificationStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showResendOption, setShowResendOption] = useState(false);
  const [isResending, setIsResending] = useState(false);
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
          setShowResendOption(true);
          return;
        }

        // Call your backend verification endpoint
        await axios.get(
          `http://localhost:8080/users/verify-email?token=${token}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setVerificationStatus("success");
        setMessage(
          "Your email has been successfully verified. Your account is now active and ready to use."
        );
      } catch (error) {
        console.error("Email verification error:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });

        setVerificationStatus("error");

        if (error.response) {
          const status = error.response.status;
          const errorData = error.response.data;
          const errorMessage =
            errorData?.message || errorData || "Unknown error occurred";

          if (status === 400) {
            setMessage(
              "Invalid verification token. The link may be malformed or corrupted."
            );
            setShowResendOption(true);
          } else if (status === 404) {
            setMessage(
              "Verification endpoint not found. Please contact support if this problem persists."
            );
          } else if (status === 410 || status === 422) {
            setMessage(
              "This verification link has expired or has already been used. You can request a new verification email below."
            );
            setShowResendOption(true);
            // Try to extract email from token or URL parameters
            extractEmailFromContext();
          } else if (status === 500) {
            setMessage(
              "Server error during verification. Please try again later or contact support."
            );
            setShowResendOption(true);
            extractEmailFromContext();
          } else {
            setMessage(
              `Verification failed (Error ${status}): ${errorMessage}`
            );
            if (status !== 409) {
              // Don't show resend for already verified accounts
              setShowResendOption(true);
              extractEmailFromContext();
            }
          }
        } else if (error.request) {
          setMessage(
            "Cannot connect to verification server. Please check your internet connection and try again."
          );
          setShowResendOption(true);
          extractEmailFromContext();
        } else {
          setMessage(
            "An unexpected error occurred during verification. Please try again later."
          );
        }
      }
    };

    const extractEmailFromContext = () => {
      // Try to get email from URL parameters (if passed from registration)
      const urlParams = new URLSearchParams(location.search);
      const email = urlParams.get("email");
      if (email) {
        setUserEmail(decodeURIComponent(email));
      }
    };

    verifyEmail();
  }, [location]);

  const resendConfirmationEmail = async () => {
    if (!userEmail) {
      alert(
        "Unable to resend confirmation email. Email address not available."
      );
      return;
    }

    setIsResending(true);
    try {
      await axios.post(
        `http://localhost:8080/users/resend-confirmation?email=${encodeURIComponent(
          userEmail
        )}`
      );
      alert(
        "Confirmation email has been resent! Please check your inbox and spam folder."
      );
      setShowResendOption(false);
    } catch (error) {
      console.error("Resend confirmation error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      if (error.response) {
        const status = error.response.status;
        const errorMessage =
          error.response.data?.message ||
          error.response.data ||
          "Unknown error occurred";

        if (status === 400) {
          alert("Invalid email address. Please check the email format.");
        } else if (status === 404) {
          alert(
            "No account found with this email address. Please register first."
          );
        } else if (status === 409) {
          alert("This email is already confirmed. You can try logging in.");
        } else if (status === 429) {
          alert(
            "Too many requests. Please wait a few minutes before trying again."
          );
        } else if (status === 500) {
          alert("Server error occurred. Please try again later.");
        } else {
          alert(`Failed to resend confirmation email: ${errorMessage}`);
        }
      } else if (error.request) {
        alert(
          "Cannot connect to server. Please check your internet connection and try again."
        );
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleEmailInput = (e) => {
    setUserEmail(e.target.value);
  };

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

            {showResendOption && (
              <div className="resend-section">
                <h3>Resend Confirmation Email</h3>
                <p>
                  Enter your email address to receive a new confirmation link:
                </p>
                <div className="email-input-group">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={userEmail}
                    onChange={handleEmailInput}
                    className="email-input"
                  />
                  <button
                    onClick={resendConfirmationEmail}
                    disabled={isResending || !userEmail}
                    className="resend-button"
                  >
                    {isResending ? "Sending..." : "Resend Email"}
                  </button>
                </div>
              </div>
            )}

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
