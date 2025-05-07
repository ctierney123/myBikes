import { Router } from "express";
import { client } from "../app.js";
import {
  getAllStations,
  getAllStatuses,
  getStationById,
  getStatusByStationId,
} from "../data/stations.js";

const router = Router();

router.get("/stations", async (req, res) => {
  try {
    const res = await getAllStations();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

router.get("/statuses", async (req, res) => {
  try {
    const res = await getAllStatuses();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

router.get("/station/:id", async (req, res) => {
  try {
    const res = await getStationById(req.params.id);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

router.get("/status/:id", async (req, res) => {
  try {
    const res = await getStatusByStationId(req.params.id);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

export default router;
