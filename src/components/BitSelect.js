import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

export default function BitSelect({ setBitType, bitType }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/bittype/bitlist`)
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
    setBitType(selectedOption);
    console.log(event.target.value);
  };

  return (
    <div>
      <select value={bitType} onChange={handleChange}>
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.bit}
          </option>
        ))}
      </select>
    </div>
  );
}
