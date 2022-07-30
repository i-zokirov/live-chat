import express from "express";
import {
    addDM,
    authenticate,
    getAllUsers,
    getDMs,
    registerUser,
    updateUser,
    verifyToken,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/signin", authenticate);
router.get("/token", verifyToken);

// protected routs that require user to be signed in
router.get("/", protect, getAllUsers);
router.put("/:userId", protect, updateUser);
router.get("/:userId/dms", protect, getDMs);
router.put("/:userId/dms/:dmId", protect, addDM);

export default router;
