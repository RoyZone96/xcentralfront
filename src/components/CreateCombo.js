import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import BitSelect from "./BitSelect";
import BladeSelect from "./BladeSelect";
import RatchetSelect from "./RatchetSelect";

export default function CreateCombo() {
    const [bit, setBit] = useState("");
    const [blade, setBlade] = useState("");
    const [ratchet, setRatchet] = useState("");

    useEffect(() => {
        console.log("Bit: ", bit);
        console.log("Blade: ", blade);
        console.log("Ratchet: ", ratchet);
    }, [bit, blade, ratchet]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Get the token from local storage
            const token = localStorage.getItem('token');

            // Check if token exists
            if (!token) {
                throw new Error('User is not authenticated');
            }

            // Decode the token to get the username
            const decodedToken = jwtDecode(token);
            const username = decodedToken.sub; // Ensure the token contains the username in the 'sub' field

            if (!username) {
                throw new Error('Username not found in token');
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Create the payload
            const payload = {
                bit,
                blade,
                ratchet,
                username
            };

            console.log('Payload:', JSON.stringify(payload));
            console.log('Headers:', headers);

            // Make the POST request to submit the combination
            const response = await axios.post('http://localhost:8080/submissions/newsub', payload, { headers });

            // Handle the response
            console.log('Submission response:', response.data);
            alert('Combo created successfully!');
        } catch (error) {
            console.error('Error creating combo:', error);
            alert('Failed to create combo');
        }
    };

    return (
        <div>
            <h1>Create Combo</h1>
            <form className="combo-form" onSubmit={handleSubmit}>
                <label htmlFor="bladeSelect">Blade Type:</label>
                <BladeSelect setBladeType={setBlade} />
                <label htmlFor="ratchetSelect">Ratchet Type:</label>
                <RatchetSelect setRatchetType={setRatchet} />
                <label htmlFor="bitSelect">Bit Type:</label>
                <BitSelect setBitType={setBit} />
                <button type="submit">Create Combo</button>
            </form>
        </div>
    );
}