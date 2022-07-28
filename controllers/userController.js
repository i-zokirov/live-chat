import expressAsyncHandler from "express-async-handler";
import User from "../mongoose-data-models/userModel.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

// @desc:   register user
// @route:  POST /api/users/signup
// @access: Public
export const registerUser = expressAsyncHandler(async (req, res) => {
    const { email, name, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User with the given email address already exists.");
    }

    const user = await User.create({
        email,
        name,
        password,
    });

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// @desc:   authenticate user
// @route:  POST /api/users/signin
// @access: Public
export const authenticate = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        if (await user.matchPassword(password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                avatar: user.avatar,
            });
        } else {
            res.status(401);
            throw new Error("Invalid email or password");
        }
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc:   verify user token user
// @route:  GET /api/users/token
// @access: Public
export const verifyToken = (req, res) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            res.json({ message: "Verified" });
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
        throw new Error("Unauthorized!");
    }
};

// @desc:   get user DMs
// @route:  GET /api/users/:userId/dms
// @access: Private
export const getDMs = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId).populate(
        "dms",
        "name email avatar"
    );
    res.json(user.dms);
});

// @desc:   add DM
// @route:  put /api/users/:userId/dms/:dmId
// @access: Private
export const addDM = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId).populate(
        "dms",
        "name email avatar"
    );

    const dm = await User.findById(req.params.dmId).populate(
        "dms",
        "name email avatar"
    );

    if (dm && user) {
        if (!user.dms.some((x) => x._id.toString === dm._id.toString())) {
            user.dms.push(dm._id);
            await user.save();
        }
        if (!dm.dms.some((x) => x._id.toString === user._id.toString())) {
            dm.dms.push(dm._id);
            await dm.save();
        }
    }

    res.json({ message: "Success" });
});

// @desc:   Get all users except current user
// @route:  GET /api/users/contacts
// @access: Private
export const getContacts = expressAsyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    const contacts = users.filter(
        (user) => user._id.toString() !== req.user._id.toString()
    );
    res.json(contacts);
});

// @desc:   Update user avatar
// @route:  PUT /api/users/:userId
// @access: Private

export const updateAvatar = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (user) {
        user.avatar = req.body.avatar;

        await user.save();
        res.json({ avatar: req.body.avatar });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});
