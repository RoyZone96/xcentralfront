import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RachetSelect() {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8080/ratchets/ratchetlist")
            .then(response => {
                setOptions(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the options!", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
  
            <select>
                {options.map(option => (
                    <option key={option.id} value={option.value}>
                        {option.rachet}
                    </option>
                ))}
            </select>
        </div>
    );
}