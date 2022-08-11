import User from "../../mongoose-data-models/userModel.js";

export const addDMHandler = async function (props, callback) {
    const { userId, requestedUserId } = props;

    try {
        const user = await User.findById(userId)
            .populate("dms", "name email avatar")
            .populate("archives", "name email avatar");

        const dm = await User.findById(requestedUserId)
            .populate("dms", "name email avatar")
            .populate("archives", "name email avatar");

        if (dm && user) {
            if (!user.dms.some((x) => x._id.toString() === dm._id.toString())) {
                user.dms.push(dm._id);
            }
            if (
                user.archives.some(
                    (x) => x._id.toString() === dm._id.toString()
                )
            ) {
                user.archives = user.archives.filter(
                    (x) => x._id.toString() !== dm._id.toString() && x
                );
            }
            await user.save();

            if (!dm.dms.some((x) => x._id.toString() === user._id.toString())) {
                dm.dms.push(user._id);
                await dm.save();
            }
        } else {
            callback({ error: "User not found!" });
        }
    } catch (error) {
        callback({ error });
    }
};
