import { Router } from "express";
import { client } from "../app.js";
import {
  getAllStationsAndStatuses,
  getNearbyStations,
  getStationByName,
  getStationById,
} from "../data/stations.js";

import { isString, isFLoat, isNumber } from "../helpers.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await getAllStationsAndStatuses();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

router.get("/nearby", async (req, res) => {
  let { lat, long, radius } = req.query;
  radius = isNumber(Number(radius));
  lat = parseFloat(lat);
  long = parseFloat(long);
  lat = isFLoat(lat, "latitude");
  long = isFLoat(long, "longitude");

  try {
    const data = await getNearbyStations(lat, long, radius);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404).json({ error: e.message });
  }
});

router.get("/search", async (req, res) => {
  let { name } = req.query;

  name = isString(name, "name");
  try {
    const data = await getStationByName(name);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

router.get("/:id", async (req, res) => {
  const id = isString(req.params.id, "station_id");
  try {
    const data = await getStationById(id);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

export default router;
