import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50,
        },
        password: {
            type: String,
            required: true,
            min: 8,
        },
        avatar: {
            type: String,
            default: "",
        },
        dms: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// custom middleware to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    console.log(enteredPassword, this.password);
    const valid = await bcrypt.compare(enteredPassword, this.password);
    if (valid) {
        console.log("Valid");
        return true;
    } else {
        console.log("Invalid");
        return false;
    }
};

// before user record is saved, password is hashed
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
export default User;
