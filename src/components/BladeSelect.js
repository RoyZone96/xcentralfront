import React, {useEffect, useState} from "react";  
import axios from "axios";

export default function BladeSelect() {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div>

            <select>
                {options.map(option => (
                    <option key={option.id} value={option.value}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
}