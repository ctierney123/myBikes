import express from "express";
import configRoutes from "./routes/index.js";
import redis from "redis";
import cors from "cors";
import "./services/scheduler.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
dotenv.config();

const app = express();

app.use(bodyParser.json());

export const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://redis:6379",
});
client.connect().then(() => {});

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
