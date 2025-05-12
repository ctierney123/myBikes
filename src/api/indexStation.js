export async function indexFavoriteStation(station) {
    const res = await fetch('http://localhost:4000/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(station)
    });
  
    if (!res.ok) {
      throw new Error('Failed to index station');
    }
  
    return await res.json();
  }
  
