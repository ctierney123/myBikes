import { Router } from "express";
import { client } from "../app";
import { isSignedIn, isSignedOut } from "../middleware.js";

const router = Router();

export default router;
