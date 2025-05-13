import { Client } from '@elastic/elasticsearch';

const client = new Client({ node: 'http://localhost:9200' });

export { client };  // Add this line to export 'client'

export async function ensureFavoriteStationsIndexExists() {
  const indexName = 'favorite_stations';
  const exists = await client.indices.exists({ index: indexName });

  if (!exists) {
    // Index doesn't exist, create it
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
    console.log(`✅ Created index "${indexName}"`);
  } else {
    // Index exists, update mappings if necessary
    const mapping = await client.indices.getMapping({ index: indexName });
    console.log(`ℹ️ Index "${indexName}" already exists. Current mapping:`, mapping);
  }
}
