import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';

const RankingPage = () => {
    const [rankings, setRankings] = useState([]);
    const [sortCriteria, setSortCriteria] = useState('winRateAverage');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8080/submissions/sublist")
            .then(response => {
                setRankings(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the rankings!", error);
                setLoading(false);
            });
    }, []);

    const handleSortChange = (event) => {
        setSortCriteria(event.target.value);
    };

    const sortedRankings = [...rankings].sort((a, b) => {
        if (sortCriteria === 'wins') {
            return b.wins - a.wins;
        } else if (sortCriteria === 'losses') {
            return b.losses - a.losses;
        } else if (sortCriteria === 'winRateAverage') {
            return b.winRateAverage - a.winRateAverage;
        }
        return 0;
    });

    return (
        <div>
            <h1>Ranking</h1>
            <div>
                <label htmlFor="sort-select">Sort by:</label>
                <select id="sort-select" value={sortCriteria} onChange={handleSortChange}>
                    <option value="wins">Wins</option>
                    <option value="losses">Losses</option>
                    <option value="winRateAverage">Win Rate Average</option>
                </select>
            </div>
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
                    </tr>
                </thead>
                <tbody>
                    {sortedRankings.map((ranking, index) => (
                        <tr key={ranking.id}>
                            <td>{index + 1}</td>
                            <td>{ranking.blade}</td>
                            <td>{ranking.ratchet}</td>
                            <td>{ranking.bit}</td>
                            <td>{ranking.wins}</td>
                            <td>{ranking.losses}</td>
                            <td>{ranking.winRateAverage}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>}
        </div>
    );
};

export default RankingPage;