import express from "express";
import configRoutes from "./routes/index.js";
import redis from "redis";
import cors from "cors";
import "./services/scheduler.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

export const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://redis:6379",
});
client.connect().then(() => {});

app.use(express.json());
app.use(cors());

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
