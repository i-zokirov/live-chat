import express from "express";
import {
    addDM,
    authenticate,
    getContacts,
    getDMs,
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
router.get("/:userId/dms", protect, getDMs);
router.put("/:userId/dms/:dmId", protect, addDM);

export default router;
