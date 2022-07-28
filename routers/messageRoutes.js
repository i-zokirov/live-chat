import express from "express";
import protect from "../middleware/authMiddleware.js";
import { retrieveMessages } from "../controllers/http/messageController.js";
const router = express.Router();

router.route("/").get(protect, retrieveMessages);

export default router;
