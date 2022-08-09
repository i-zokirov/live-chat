import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../mongoose-data-models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.userId).select("-password");

            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw error;
            }
            if (process.env.NODE_ENV !== "production") {
                console.error("Error occured while token validation", error);
            }
            res.status(401);
            throw new Error("Not authorized, token validation failed!");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized!");
    }
});

export default protect;
