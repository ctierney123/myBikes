import { Router } from "express";
import { client } from "../app.js";
import {
  getAllStationsAndStatuses,
  getNearbyStations,
  getStationById,
} from "../data/stations.js";

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
  try {
    const data = await getNearbyStations(40.82319448542357, -73.88762910982096);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await getStationById(req.params.id);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

export default router;
