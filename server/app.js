import express from "express";
import configRoutes from "./routes/index.js";
import redis from "redis";

const app = express();

export const client = redis.createClient();
client.connect().then(() => {});

app.use(express.json());

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
