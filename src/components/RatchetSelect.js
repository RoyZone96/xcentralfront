import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RatchetSelect({ setRatchetType, ratchetType }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/ratchets/ratchetlist")
      .then((response) => {
        setOptions(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the options!", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleChange = (event) => {
    const selectedOption = event.target.value;
    setRatchetType(selectedOption); // Update the parent component's state
    console.log(selectedOption);
  };

  return (
    <div>
      <select value={ratchetType} onChange={handleChange}>
        {options.map((option) => (
          <option key={option.id} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
