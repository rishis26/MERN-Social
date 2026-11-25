import express from "express";
import { loginUser, registerUser } from "../controllers/authControllers.js";
import uploadFile from "../Middleware/multer.js";

const router = express.Router();

router.post("/register", uploadFile, registerUser);
router.post("/login", loginUser);

export default router;
