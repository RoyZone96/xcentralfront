import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

export default function BladeSelect({ setBladeType, bladeType }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/blade_parts/bladelist`)
      .then((response) => {
        setOptions(response.data);
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
    setBladeType(selectedOption); // Update the parent component's state
    console.log(selectedOption);
  };

  return (
    <div>
      <select value={bladeType} onChange={handleChange}>
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
