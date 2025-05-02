import React, { useState } from 'react';

const DrinkSearch = () => {
  const [query, setQuery] = useState('');
  const [drink, setDrink] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const searchDrink = async () => {
    if (!query.trim()) {
      setError('Please enter a drink name.');
      setDrink(null);
      return;
    }

    setLoading(true);
    setError('');
    setDrink(null);

    const encodedQuery = encodeURIComponent(query);
    const apiUrl = `https://services.baxus.co/api/search/listings?from=0&size=20&listed=true&q=${encodedQuery}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data?.data?.length) {
        setError('No results found.');
        return;
      }

      const match = data.data[0];
      const drinkInfo = {
        name: match.title || 'Unnamed',
        price: match.listing_price?.amount
          ? (match.listing_price.amount / 100).toFixed(2)
          : 'N/A',
        imageUrl: match.image_url,
        link: `https://baxus.co/asset/${match.asset_id}`,
      };

      setDrink(drinkInfo);
    } catch (err) {
      console.error('API Error:', err);
      setError('Something went wrong. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Drink Price Checker (BAXUS)</h2>
      <input
        type="text"
        placeholder="Enter drink name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />
      <button onClick={searchDrink} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {drink && (
        <div style={{ marginTop: 20 }}>
          <img src={drink.imageUrl} alt={drink.name} style={{ width: '100%' }} />
          <h3>{drink.name}</h3>
          <p><strong>Price:</strong> ${drink.price}</p>
          <a href={drink.link} target="_blank" rel="noopener noreferrer">
            View on BAXUS
          </a>
        </div>
      )}
    </div>
  );
};

export default DrinkSearch;
