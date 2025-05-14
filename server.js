import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { client, ensureFavoriteStationsIndexExists } from "../elasticsearch/elasticsearchClient.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// Ensure the favorite_stations index exists on server start
ensureFavoriteStationsIndexExists();

// Search route (searches the all_stations index)
app.get('/api/search', async (req, res) => {
  const { q, page = 0 } = req.query;
  const pageSize = 10;

  if (!q) return res.status(400).json({ error: 'Missing query' });

  const body = {
    query: {
      multi_match: {
        query: q,
        fields: ['name^2', 'address']
      }
    },
    from: page * pageSize,
    size: pageSize
  };

  try {
    const { hits } = await client.search({
      index: 'all_stations',
      body
    });

    const results = hits.hits.map(hit => hit._source);
    res.json({ results });
  } catch (err) {
    console.error('Search error:', err.meta?.body?.error || err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Add to favorites route
app.post('/api/favorites', async (req, res) => {
  const station = req.body;

  if (!station || !station.id || !station.name) {
    return res.status(400).json({ error: 'Missing station data' });
  }

  try {
    // Try to get the station to see if it already exists
    await client.get({
      index: 'favorite_stations',
      id: station.id
    });

    // If it didn't throw, it already exists
    return res.status(409).json({ error: 'Station already in favorites' });

  } catch (err) {
    // If error is 404, station does not exist — safe to add
    if (err.meta?.statusCode === 404) {
      await client.index({
        index: 'favorite_stations',
        id: station.id,
        body: station,
        refresh: 'wait_for' // <--- ensures it's immediately searchable
      });

      return res.json({ message: 'Station added to favorites' });
    }

    // Other error
    console.error('Add favorite error:', err.meta?.body?.error || err);
    return res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// Delete favorite station by ID
app.delete('/api/favorites/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to remove favorite with ID: ${id}`);
  
  try {
    // Check if the station exists in Elasticsearch
    const stationExists = await client.exists({
      index: 'favorite_stations',
      id: id,
    });
  
    if (!stationExists) {
      console.log('Station not found in Elasticsearch');
      return res.status(404).json({ error: 'Station not found' });
    }
  
    // Delete the station from Elasticsearch
    await client.delete({
      index: 'favorite_stations',
      id: id,
    });
  
    console.log(`Station with ID ${id} successfully deleted.`);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error during deletion:', err);
    return res.status(500).json({ error: 'Failed to delete station' });
  }
});

// Get all favorite stations
app.get('/api/favorites', async (req, res) => {
  try {
    const { hits } = await client.search({
      index: 'favorite_stations',
      body: {
        query: { match_all: {} },
        size: 100
      }
    });

    const favorites = hits.hits.map(hit => hit._source);
    res.json({ favorites });
  } catch (err) {
    console.error('Get favorites error:', err.meta?.body?.error || err);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;  // Default export of app here
