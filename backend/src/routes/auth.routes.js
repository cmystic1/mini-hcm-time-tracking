import express from "express";
import { getProfile, register } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/profile", getProfile);
router.post("/register", register);

export default router;