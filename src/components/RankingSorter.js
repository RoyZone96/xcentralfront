import React, { useState } from 'react';

const RankingSorter = ({ rankings }) => {
    const [sortBy, setSortBy] = useState('wins'); // Default sort option is 'wins'

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const sortRankings = () => {
        // Implement the sorting logic based on the selected sort option
        // You can use the 'sortBy' state variable to determine the sorting criteria
        // and the 'rankings' prop to access the rankings data

        // Example sorting logic for 'wins':
        if (sortBy === 'wins') {
            return rankings.sort((a, b) => b.wins - a.wins);
        }

        // Example sorting logic for 'losses':
        if (sortBy === 'losses') {
            return rankings.sort((a, b) => a.losses - b.losses);
        }

        // Example sorting logic for 'win rate average':
        if (sortBy === 'winRateAverage') {
            return rankings.sort((a, b) => b.winRateAverage - a.winRateAverage);
        }

        // Return the rankings array as is if no valid sort option is selected
        return rankings;
    };

    const sortedRankings = sortRankings();

    return (
        <div>
            <label htmlFor="sort-select">Sort by:</label>
            <select id="sort-select" value={sortBy} onChange={handleSortChange}>
                <option value="wins">Wins</option>
                <option value="losses">Losses</option>
                <option value="winRateAverage">Win Rate Average</option>
            </select>

            <ul>
                {sortedRankings.map((ranking) => (
                    <li key={ranking.id}>{ranking.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default RankingSorter;