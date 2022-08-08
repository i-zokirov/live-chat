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
    if (user) {
        res.json(user.dms);
    } else {
        res.status(404);
        throw new Error("User not found!");
    }
});

// @desc:   get user Archives
// @route:  GET /api/users/:userId/archives
// @access: Private
export const getArchives = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId).populate(
        "archives",
        "name email avatar"
    );
    if (user) {
        res.json(user.archives);
    } else {
        res.status(404);
        throw new Error("User not found!");
    }
});

// @desc:   add DM
// @route:  put /api/users/:userId/dms/:dmId
// @access: Private
export const addDM = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId)
        .populate("dms", "name email avatar")
        .populate("archives", "name email avatar");

    const dm = await User.findById(req.params.dmId)
        .populate("dms", "name email avatar")
        .populate("archives", "name email avatar");

    if (dm && user) {
        if (!user.dms.some((x) => x._id.toString() === dm._id.toString())) {
            user.dms.push(dm._id);
        }
        if (user.archives.some((x) => x._id.toString() === dm._id.toString())) {
            user.archives = user.archives.filter((x) => {
                if (x._id.toString() !== dm._id.toString()) {
                    return x;
                }
            });
        }
        await user.save();

        if (!dm.dms.some((x) => x._id.toString() === user._id.toString())) {
            dm.dms.push(user._id);
            await dm.save();
        }
        res.json({ message: "Success" });
    } else {
        res.status(404);
        throw new Error("User not found!");
    }
});

// @desc:   delete DM
// @route:  delete /api/users/:userId/dms/:dmId
// @access: Private
export const deleteDM = expressAsyncHandler(async (req, res) => {
    console.log(`DELETE DM Request`);
    const user = await User.findById(req.params.userId)
        .populate("dms", "name email avatar")
        .populate("archives", "name email avatar");

    const dm = await User.findById(req.params.dmId)
        .populate("dms", "name email avatar")
        .populate("archives", "name email avatar");

    if (dm && user) {
        if (user.dms.some((x) => x._id.toString() === dm._id.toString())) {
            user.dms = user.dms.filter((x) => {
                if (x._id.toString() !== dm._id.toString()) {
                    return x;
                }
            });
        }

        if (user.archives.some((x) => x._id.toString() === dm._id.toString())) {
            user.archives = user.archives.filter((x) => {
                if (x._id.toString() !== dm._id.toString()) {
                    return x;
                }
            });
        }
        await user.save();

        if (dm.dms.some((x) => x._id.toString() === user._id.toString())) {
            dm.dms = dm.dms.filter((x) => {
                if (x._id.toString() !== user._id.toString()) {
                    return x;
                }
            });
        }
        if (dm.archives.some((x) => x._id.toString() === user._id.toString())) {
            dm.archives = dm.archives.filter((x) => {
                if (x._id.toString() !== user._id.toString()) {
                    return x;
                }
            });
        }
        await dm.save();
        res.json({ message: "Success" });
    } else {
        res.status(404);
        throw new Error("User not found!");
    }
});

// @desc:   archive DM
// @route:  patch /api/users/:userId/dms/:dmId
// @access: Private
export const archiveDM = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId)
        .populate("dms", "name email avatar")
        .populate("archives", "name email avatar");
    const dm = await User.findById(req.params.dmId)
        .populate("dms", "name email avatar")
        .populate("archives", "name email avatar");

    if (dm && user) {
        if (user.dms.some((x) => x._id.toString() === dm._id.toString())) {
            user.dms = user.dms.filter((x) => {
                if (x._id.toString() !== dm._id.toString()) {
                    return x;
                }
            });
        }

        if (
            !user.archives.some((x) => x._id.toString() === dm._id.toString())
        ) {
            user.archives.push(dm._id);
        }
        await user.save();
        res.json({ message: "Success" });
    } else {
        res.status(404);
        throw new Error("User not found!");
    }
});

// @desc:   Get all users except current user
// @route:  GET /api/users/
// @access: Private
export const getAllUsers = expressAsyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    const contacts = users.filter(
        (user) => user._id.toString() !== req.user._id.toString()
    );
    res.json(contacts);
});

// @desc:   Update user avatar
// @route:  PUT /api/users/:userId
// @access: Private

export const updateUser = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (user) {
        user.avatar = req.body.avatar ? req.body.avatar : user.avatar;
        user.name = req.body.name ? req.body.name : user.name;
        user.email = req.body.email ? req.body.email : user.email;

        if (req.body.newPassword) {
            if (await user.matchPassword(req.body.password)) {
                user.password = req.body.newPassword;
            } else {
                throw new Error("Invalid password");
            }
        }
        const saved = await user.save();

        res.json(saved);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});
