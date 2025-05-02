import React, { useState } from 'react';
import axios from 'axios';

const DrinkSearchh = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchDrinks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('https://services.baxus.co/api/search/listings', {
        params: {
          from: 0,
          size: 20,
          listed: true,
          query: searchTerm
        }
      });

      // If API doesn't support query parameter, filter client-side
      let results = response.data.items || [];
      if (!response.config.params.query) {
        results = results.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setSearchResults(results);
    } catch (err) {
      setError('Failed to fetch drink data. Please try again.');
      console.error('API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchDrinks();
    }
  };

  return (
    <div className="drink-search-container">
      <h1>Drink Search</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter drink name..."
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="results">
          {searchResults.length > 0 ? (
            <ul>
              {searchResults.map((drink, index) => (
                <li key={index}>
                  <strong>{drink.name}</strong> - 
                  {drink.price ? ` $${drink.price.amount}` : ' Price not available'}
                </li>
              ))}
            </ul>
          ) : (
            searchTerm && !error && <div>No drinks found matching "{searchTerm}"</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DrinkSearchh;