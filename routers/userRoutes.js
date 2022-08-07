import express from "express";
import {
    addDM,
    authenticate,
    deleteDM,
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

// protected routes that require user to be signed in
router.get("/", protect, getAllUsers);
router.put("/:userId", protect, updateUser);
router.get("/:userId/dms", protect, getDMs);
router
    .route("/:userId/dms/:dmId")
    .put(protect, addDM)
    .delete(protect, deleteDM);

export default router;
