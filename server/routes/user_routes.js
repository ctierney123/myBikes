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

  // not for prod
router.get('/test-email', async (_req, res) => {
  try {
    const testUser = {
      email: 'connortierneymisc@gmail.com', 
      username: 'connortierneymisc@gmail.com',
      userId: 'test-user-123'
    };
    
    
    const testStation = {
      name: 'Central Park Station',
      station_id: 'c-123',
      num_bikes_available: 0
    };
    
    
    await sendStationNotification(testUser, testStation);
    res.json({ 
      success: true,
      message: 'Test email sent successfully' 
    });
  } catch (error) {
    console.error('Test email failed:', error);
    res.status(500).json({ 
      error: 'Test email failed',
      details: error.message 
    });
  }
});


export default router;
