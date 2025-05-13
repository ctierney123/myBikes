import { Router } from "express";
import { client } from "../app.js";
//import { isSignedIn, isSignedOut } from "../middleware.js";
import { isString, isUsername } from "../helpers.js";
import {
  createUser,
  getAllUsers,
  getUserById,
  removeUser,
  updateUser,
} from "../data/users.js";
import { sendStationNotification } from '../data/notifications.js';

const router = Router();

// create user in db
router.post("/", async (req, res) => {
  const userData = req.body;
  const userId = req.user.uid;

  let { username, email } = userData;

  try {
    username = isUsername(username, "username");
    if (email) {
      email = isEmail(email, "email");
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  try {
    const data = await createUser(userId, username, email);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await getAllUsers();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const data = await getUserById(req.params.id);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  })
  .put(async (req, res) => {
    const userId = req.user.uid;

    const updateObject = req.body;
    if (!updateObject || Object.keys(updateObject).length === 0) {
      return res.status(400).json({ error: "No request body" });
    }

    try {
      userId = isString(userId, "userId");
      updateObject = isObject(updateObject, "updateObject");

      const updateObjectKeys = Object.keys(updateObject);
      const updatedUser = await getUserById(userId);

      let { username, favorites, email } = updateObject;

      if (updateObjectKeys.includes("username")) {
        username = isString(username, "username");
        updatedUser.username = username;
      }

      if (updateObjectKeys.includes("favorites")) {
        favorites = favorites.array.forEach((favorite) => {
          favorite = favorite.isFavorite(favorite, "favorite");
        });
        updatedUser.favorites = favorites;
        await client.lset(`${userId}/favorites`, JSON.stringify(favorites));
      }
      if (updateObjectKeys.includes("email")) {
      if (email === null) {
        updatedUser.email = null;
      } else {
        email = isEmail(email, "email");
        updatedUser.email = email;
      }
    }

    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const data = updateUser(userId, updateObject);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    const userId = req.user.uid;

    try {
      userId = isString(userId, "userId");
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    try {
      const data = removeUser(userId);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  });

router.get('/:id/notification-preferences', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    
    const preferences = user.notificationPreferences || {
      emailNotifications: false,
      dailyDigest: false,
      digestTime: "08:00"
    };
    
    return res.status(200).json(preferences);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.put('/:id/notification-preferences', async (req, res) => {
  try {
    const userId = req.params.id;
    const { emailNotifications, dailyDigest, digestTime } = req.body;
    
    if (typeof emailNotifications !== 'boolean' || 
        typeof dailyDigest !== 'boolean' ||
        !/^([01]\d|2[0-3]):([0-5]\d)$/.test(digestTime)) {
      return res.status(400).json({ error: 'Invalid preferences format' });
    }
    
    const updatedUser = await updateUser(userId, { 
      notificationPreferences: { 
        emailNotifications, 
        dailyDigest, 
        digestTime 
      }
    });
    
    return res.status(200).json(updatedUser.notificationPreferences);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// remove in prod, just test
router.get('/test-daily-digest', async (_req, res) => {
  try {
    await sendDailyDigest();
    res.json({ success: true, message: 'Test daily digest sent' });
  } catch (error) {
    console.error('Test daily digest failed:', error);
    res.status(500).json({ error: 'Test daily digest failed' });
  }
});


export default router;
