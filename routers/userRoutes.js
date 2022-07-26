import express from "express";
import {
    authenticate,
    getContacts,
    registerUser,
    updateAvatar,
    verifyToken,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/signin", authenticate);
router.get("/token", verifyToken);
router.get("/contacts", protect, getContacts);
router.put("/:userId", protect, updateAvatar);

export default router;
