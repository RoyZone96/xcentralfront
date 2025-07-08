import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import BitSelect from "../../components/BitSelect";
import BladeSelect from "../../components/BladeSelect";
import RatchetSelect from "../../components/RatchetSelect";
import "./CreateCombo.css";

export default function CreateCombo() {
  const [bit, setBit] = useState("Ball");
  const [blade, setBlade] = useState("Black Shell");
  const [ratchet, setRatchet] = useState("2-60");
  const navigate = useNavigate(); 

  useEffect(() => {
    console.log("Bit: ", bit);
    console.log("Blade: ", blade);
    console.log("Ratchet: ", ratchet);
  }, [bit, blade, ratchet]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Get the token from local storage
      const token = localStorage.getItem("token");

      // Check if token exists
      if (!token) {
        throw new Error("User is not authenticated");
      }

      // Decode the token to get the username
      const decodedToken = jwtDecode(token);
      const username = decodedToken.sub; // Ensure the token contains the username in the 'sub' field

      if (!username) {
        throw new Error("Username not found in token");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Create the payload
      const payload = {
        bit,
        blade,
        ratchet,
        username,
      };

      console.log("Payload:", JSON.stringify(payload));
      console.log("Headers:", headers);

      // Make the POST request to submit the combination
      const response = await axios.post(
        "http://localhost:8080/submissions/newsub",
        payload,
        { headers }
      );

      // Handle the response
      console.log("Submission response:", response.data);
      alert("Combo created successfully!");
      navigate("/myPage"); // Redirect to MyPage after successful submission
    } catch (error) {
      console.error("Error creating combo:", error);
      alert("Failed to create combo");
    }
  };

  return (
    <div>
      <h1>Create Combo</h1>
      <form className="combo-form" onSubmit={handleSubmit}>
        <div className="combo-row">
          <label htmlFor="bladeSelect" className="combo-label">
            Blade Type:
          </label>
          <div className="combo-select">
            <BladeSelect setBladeType={setBlade} />
          </div>
        </div>
        <div className="combo-row">
          <label htmlFor="ratchetSelect" className="combo-label">
            Ratchet Type:
          </label>
          <div className="combo-select">
            <RatchetSelect setRatchetType={setRatchet} />
          </div>
        </div>
        <div className="combo-row">
          <label htmlFor="bitSelect" className="combo-label">
            Bit Type:
          </label>
          <div className="combo-select">
            <BitSelect setBitType={setBit} />
          </div>
        </div>
        <button type="submit">Create Combo</button>
      </form>
    </div>
  );
}
