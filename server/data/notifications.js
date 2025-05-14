import nodemailer from "nodemailer";
import { getStationById } from "./stations.js";
import { getFavoritesByUserId } from "./favorites.js";
import { getUserById } from "./users.js";
import dotenv from "dotenv";
dotenv.config();
import { client } from "../app.js";

// EMAIL SETUP
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Error with SendGrid connection:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

const hasBeenNotified = async (userId, stationId) => {
  return await client.get(`notification:${userId}:${stationId}`);
};

const markAsNotified = async (userId, stationId) => {
  await client.set(`notification:${userId}:${stationId}`, "1", {
    EX: 86400, // 24 hours
  });
};

const clearNotificationFlag = async (userId, stationId) => {
  await client.del(`notification:${userId}:${stationId}`);
};

export const checkFavoriteStationsAvailability = async () => {
  try {
    const users = await client.lRange("users", 0, -1);

    for (const userId of users) {
      const user = await getUserById(userId);
      if (!user.email) continue;

      const favorites = await getFavoritesByUserId(userId);

      for (const stationId of favorites) {
        const station = await getStationById(stationId);

        if (station.num_bikes_available === 0) {
          if (!(await hasBeenNotified(userId, stationId))) {
            await sendStationNotification(user, station);
            await markAsNotified(userId, stationId);
          }
        } else {
          await clearNotificationFlag(userId, stationId);
        }
      }
    }
  } catch (error) {
    console.error("Error checking station availability:", error);
  }
};

export const sendDailyDigest = async () => {
  try {
    const users = await client.lRange("users", 0, -1);
    const currentHour = new Date().getHours();
    
    for (const userId of users) {
      const user = await getUserById(userId);
      
      // Skip if no email or notifications disabled
      if (!user.email || !user.notificationPreferences?.emailNotifications) continue;
      
      // Check if it's time for this user's digest
      const userHour = parseInt(user.notificationPreferences?.digestTime?.split(':')[0] || 8);
      if (currentHour !== userHour) continue;
      
      // Skip if daily digest is disabled
      if (!user.notificationPreferences?.dailyDigest) continue;
      
      const favorites = await getFavoritesByUserId(userId);
      const stations = await Promise.all(favorites.map(id => getStationById(id)));
      
      const mailOptions = {
        from: {
          name: "MyBikes Notifications",
          address: process.env.EMAIL_FROM,
        },
        to: user.email,
        subject: `🚴 Your Daily Bike Station Digest`,
        html: generateDailyDigestHtml(user, stations),
      };
      
      await transporter.sendMail(mailOptions);
      console.log(`Daily digest sent to ${user.email}`);
    }
  } catch (error) {
    console.error("Error sending daily digests:", error);
  }
};


// actual email
const sendStationNotification = async (user, station) => {
  const mailOptions = {
    from: {
      name: "MyBikes Notifications",
      address: process.env.EMAIL_FROM,
    },
    to: user.email,
    subject: `🚴 No bikes available at ${station.name}`,
    text: `Hello ${user.username},\n\nThere are currently no bikes available at your favorite station: ${station.name} (${station.station_id}).\n\nPlease consider checking another nearby station.\n\nBest regards,\nMyBikes Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Hello ${user.username},</h2>
        <p>There are currently <strong>no bikes available</strong> at:</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="margin-top: 0;">${station.name}</h3>
          <p>Station ID: ${station.station_id}</p>
          <p>Last updated: ${new Date().toLocaleString()}</p>
        </div>
        <p>Please consider checking another nearby station.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 0.9em; color: #7f8c8d;">
          <a href="http://localhost:5173/dashboard/settings" style="color: #3498db;">Unsubscribe</a> | 
          <a href="http://localhost:5173/dashboard/settings" style="color: #3498db;">Notification Preferences</a>
        </p>
      </div>
    `,
    // sendgrid headers
    headers: {
      "X-SMTPAPI": JSON.stringify({
        filters: {
          clicktrack: { settings: { enable: 0 } },
          opentrack: { settings: { enable: 0 } },
        },
      }),
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Notification sent to ${user.email}`, info.messageId);
    return info;
  } catch (error) {
    console.error(`Error sending to ${user.email}:`, error);
    throw error;
  }
};



const generateDailyDigestHtml = (user, stations) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const stationRows = stations.map(station => `
    <tr style="border-bottom: 1px solid #e0e0e0;">
      <td style="padding: 12px 0;">
        <h3 style="margin: 0 0 4px 0; color: #2c3e50;">${station.name}</h3>
        <p style="margin: 0; color: #7f8c8d; font-size: 0.9em;">Station ID: ${station.station_id}</p>
      </td>
      <td style="text-align: center; padding: 12px 0;">
        <span style="display: inline-block; 
                    background-color: ${station.num_bikes_available > 0 ? '#2ecc71' : '#e74c3c'}; 
                    color: white; 
                    padding: 4px 8px; 
                    border-radius: 4px;
                    font-weight: bold;">
          ${station.num_bikes_available} bikes
        </span>
      </td>
      <td style="text-align: center; padding: 12px 0;">
        <span style="display: inline-block; 
                    background-color: ${station.num_docks_available > 0 ? '#3498db' : '#e74c3c'}; 
                    color: white; 
                    padding: 4px 8px; 
                    border-radius: 4px;
                    font-weight: bold;">
          ${station.num_docks_available} docks
        </span>
      </td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #34495e;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #2c3e50;">🚴 Your Daily Bike Station Digest</h1>
        <p style="margin: 8px 0 0 0; color: #7f8c8d;">${dateStr} at ${timeStr}</p>
      </div>

      <p style="margin: 20px 0;">Hello ${user.username}, here's the current status of your favorite stations:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="border-bottom: 2px solid #e0e0e0;">
            <th style="text-align: left; padding: 8px 0;">Station</th>
            <th style="text-align: center; padding: 8px 0;">Bikes</th>
            <th style="text-align: center; padding: 8px 0;">Docks</th>
          </tr>
        </thead>
        <tbody>
          ${stationRows}
        </tbody>
      </table>

      <div style="margin: 30px 0; text-align: center;">
        <a href="${process.env.APP_URL || 'http://localhost:5173/dashboard'}" 
           style="display: inline-block; 
                  background-color: #3498db; 
                  color: white; 
                  padding: 12px 24px; 
                  text-decoration: none; 
                  border-radius: 4px;
                  font-weight: bold;">
          View All Stations
        </a>
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 0.9em; color: #7f8c8d;">
        <p style="margin: 5px 0;">
          <strong>Notification preferences:</strong> 
          ${user.notificationPreferences?.emailNotifications ? 'Enabled' : 'Disabled'} •
          ${user.notificationPreferences?.dailyDigest ? `Daily digest at ${user.notificationPreferences.digestTime}` : 'No daily digest'}
        </p>
        <p style="margin: 5px 0;">
          <a href="${process.env.APP_URL || 'http://localhost:5173'}/dashboard/settings" style="color: #3498db; text-decoration: none;">
            Update notification preferences
          </a> | 
          <a href="${process.env.APP_URL || 'http://localhost:5173'}/dashboard/settings" style="color: #3498db; text-decoration: none;">
            Unsubscribe
          </a>
        </p>
      </div>
    </div>
  `;
};


export { sendStationNotification };
