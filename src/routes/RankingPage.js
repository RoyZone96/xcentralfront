import React, { useState, useEffect } from "react";  
import RankingSorter from "../components/RankingSorter";
import Table from "react-bootstrap/Table";
import axios from "axios";


export default function RankingPage() {

    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8080/submissions/sublist")
            .then(response => {
                setOptions(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the options!", error);
                setLoading(false);
            });
    }, []);

    return(
        <div>
            <h1>Ranking</h1>
            <RankingSorter rankings={options} />
            {loading ? <p>Loading...</p> : 
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Ranking</th>
                        <th>Blade</th>
                        <th>Ratchet</th>
                        <th>Bit</th>
                        <th>Wins</th>
                        <th>Losses</th>
                        <th>Win Rate</th>
                        <th>Posted by</th>
                    </tr>
                </thead>
                <tbody>
                    {options.map((option, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{option.blade}</td>
                                <td>{option.ratchet}</td>
                                <td>{option.bit}</td>
                                <td>{option.wins}</td>
                                <td>{option.losses}</td>
                                <td>{option.winRateAvg}</td>
                                <td>{option.userId}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>}
        </div>
    )

}