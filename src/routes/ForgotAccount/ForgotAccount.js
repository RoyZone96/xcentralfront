import React, { useState } from "react";

const ForgotAccount = () => {
  const [activeTab, setActiveTab] = useState("username");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle forgot username/password
    setMessage(
      "If an account with that email exists, you will receive an email with further instructions."
    );
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle forgot username/password
    setMessage(
      "If an account with that email exists, you will receive an email with further instructions."
    );
  };

  return (
    <div className="forgot-account">
    <h2>Forgot Username or Password</h2>
    <div className="tabs">
      <button onClick={() => setActiveTab('username')} className={activeTab === 'username' ? 'active' : ''}>
        Forgot Password (Username Known)
      </button>
      <button onClick={() => setActiveTab('email')} className={activeTab === 'email' ? 'active' : ''}>
        Forgot Username and Password
      </button>
    </div>
    {activeTab === 'username' && (
      <form onSubmit={handleUsernameSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    )}
    {activeTab === 'email' && (
      <form onSubmit={handleEmailSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    )}
    {message && <p>{message}</p>}
  </div>
  );
};

export default ForgotAccount;
