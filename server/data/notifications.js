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
          <a href="unsubscribe placeholder link" style="color: #3498db;">Unsubscribe</a> | 
          <a href="settings placeholder link" style="color: #3498db;">Notification Preferences</a>
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

export { sendStationNotification };
