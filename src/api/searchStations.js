export async function searchFavoriteStations(query) {
    const res = await fetch('http://localhost:4000/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });
  
    if (!res.ok) {
      throw new Error('Elasticsearch search failed');
    }
  
    const data = await res.json();
    return data.results;
  }
  
