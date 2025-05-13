import { Router } from "express";
import { client } from "../app.js";
//import { isSignedIn, isSignedOut } from "../middleware.js";
import { isId, isString, isUsername, isEmail } from "../helpers.js";
import {
  createUser,
  getAllUsers,
  getUserById,
  removeUser,
  updateUser,
} from "../data/users.js";
import { sendStationNotification } from '../data/notifications.js';

const router = Router();



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
