import { Client } from '@elastic/elasticsearch';

const client = new Client({ node: 'http://localhost:9200' });

export { client };

export async function ensureFavoriteStationsIndexExists() {
  const indexName = 'favorite_stations';
  const exists = await client.indices.exists({ index: indexName });

  if (!exists) {
    await client.indices.create({
      index: indexName,
      body: {
        mappings: {
          properties: {
            id: { type: 'keyword' },
            name: { type: 'text' },
            address: { type: 'text' },
            num_bikes_available: { type: 'integer' },
            num_docks_available: { type: 'integer' },
            city: { type: 'text' },
            status: { type: 'text' }
          }
        }
      }
    });
    console.log(`Created index "${indexName}"`);
  } else {
    const mapping = await client.indices.getMapping({ index: indexName });
    console.log(`Index "${indexName}" already exists. Current mapping:`, mapping);
  }
}

export async function ensureUserPreferencesIndexExists() {
  const indexName = 'user_preferences';
  const exists = await client.indices.exists({ index: indexName });

  if (!exists) {
    await client.indices.create({
      index: indexName,
      body: {
        mappings: {
          properties: {
            preferences: {
              type: 'object',
              properties: {
                emailNotifications: { type: 'boolean' },
                dailyDigest: { type: 'boolean' },
                digestTime: { type: 'keyword' }
              }
            }
          }
        }
      }
    });
    console.log(`Created index "${indexName}"`);
  } else {
    const mapping = await client.indices.getMapping({ index: indexName });
    console.log(`Index "${indexName}" already exists. Current mapping:`, mapping);
  }
}