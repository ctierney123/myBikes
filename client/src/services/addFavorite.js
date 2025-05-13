const BACKEND_URL = 'http://localhost:4000';

export const addFavorite = async (station) => {
  const response = await fetch(`${BACKEND_URL}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(station),
  });

  if (!response.ok) {
    throw new Error('Failed to add favorite');
  }

  return await response.json();
};
