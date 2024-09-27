import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BladeSelect({ setBladeType }) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [option, setOption] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/blade_parts/bladelist")
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

    const handleChange = (event) => {
        const selectedOption = event.target.value;
        setOption(selectedOption);
        setBladeType(selectedOption); // Update the parent component's state
        console.log(selectedOption);
    };

    return (
        <div>
            <select value={option} onChange={handleChange}>
                {options.map(option => (
                    <option key={option.id} value={option.value}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
}