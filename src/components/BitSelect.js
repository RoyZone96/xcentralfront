import React, {useEffect, useState} from "react";
import axios from "axios";

export default function BitSelect({setBitType}) {
    const [options, setOptions] = useState([]);
    const [option, setOption] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8080/bittype/bitlist")
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
        setBitType(selectedOption);
        console.log(event.target.value);
    }

    return (
        <div>
          
            <select value={option} onChange={handleChange}>
                {options.map(option => (
                    <option key={option.id} value={option.value}>
                        {option.bit}
                    </option>
                ))}
            </select>
        </div>
    );
}
