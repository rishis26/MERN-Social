import express from "express";
import { myProfile } from "../controllers/userControllers.js";
import { isAuth } from "../Middleware/isAuth.js";

const router = express.Router();

router.get("/me", isAuth, myProfile);

export default router;
