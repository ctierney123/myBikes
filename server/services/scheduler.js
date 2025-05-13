import { checkFavoriteStationsAvailability, sendDailyDigest } from '../data/notifications.js';
import cron from 'node-cron';

// checks station availability every 15 mins
cron.schedule('*/15 * * * *', async () => {
  console.log('Checking station availability for immediate notifications...');
  await checkFavoriteStationsAvailability();
});

// checks for daily digest emails every hour
cron.schedule('0 * * * *', async () => {
  console.log('Checking for daily digest emails...');
  await sendDailyDigest();
});

export { checkFavoriteStationsAvailability };