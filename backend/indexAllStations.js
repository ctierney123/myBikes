import fetch from 'node-fetch';
import client from './elasticsearchClient.js';

async function indexAllStations() {
  const res = await fetch('https://gbfs.citibikenyc.com/gbfs/en/station_information.json');
  const data = await res.json();
  const stations = data.data.stations;

  for (const station of stations) {
    await client.index({
      index: 'all_stations',
      id: station.station_id,
      document: {
        id: station.station_id,
        name: station.name,
        address: station.address || '',
        lat: station.lat,
        lon: station.lon,
        capacity: station.capacity || 0
      }
    });
  }

  await client.indices.refresh({ index: 'all_stations' });
  console.log('✅ Indexed all stations into Elasticsearch');
}

indexAllStations().catch(console.error);
