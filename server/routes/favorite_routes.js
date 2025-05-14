import { Router } from "express";
import { verifyToken } from "../middleware/index.js";
import {
  getFavoritesByUserId,
  addFavorite,
  removeFavorite,
} from "../data/favorites.js";

const router = Router();

//get all of users favorite stations
router.get("/", async (req, res) => {
  try {
    const userId = "lAnG0qJBJ6gGj8ICaPFmaycMPG43";
    // const userId = req.user.uid;
    const data = await getFavoritesByUserId(userId);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(404).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  const userId = "lAnG0qJBJ6gGj8ICaPFmaycMPG43";
  // const userId = req.user.uid;
  const { stationId } = req.body;

  if (!stationId) {
    return res.status(400).json({ error: "Station ID is required" });
  }

  try {
    const data = await addFavorite(userId, stationId);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e.message });
  }
});

router.delete("/", async (req, res) => {
  const userId = "lAnG0qJBJ6gGj8ICaPFmaycMPG43";
  // const userId = req.user.uid;
  const { stationId } = req.body;

  if (!stationId) {
    return res.status(400).json({ error: "Station ID is required" });
  }

  try {
    const data = await removeFavorite(userId, stationId);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e.message });
  }
});

export default router;
