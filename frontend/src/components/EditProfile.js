import { Typography, Box, TextField, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/actions/actions";
import TransitionModal from "./TransitionModal";

const EditProfile = ({ open, handleClose, user }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setnewPassword] = useState("");
    const theme = useTheme();
    const dispatch = useDispatch();
    const handleChange = (e) => {
        switch (e.currentTarget.name) {
            case "name":
                setName(e.currentTarget.value);
                break;
            case "email":
                setEmail(e.currentTarget.value);
                break;
            case "currentPassword":
                setCurrentPassword(e.currentTarget.value);
                break;
            case "newPassword":
                setnewPassword(e.currentTarget.value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = () => {
        if (email && name && currentPassword && newPassword) {
            const reqbody = {
                name,
                email,
                password: currentPassword,
                newPassword,
            };
            dispatch(updateUser(reqbody));

            setnewPassword("");
            setCurrentPassword("");
            handleClose();
        }
    };
    return (
        <TransitionModal open={open} handleClose={handleClose}>
            <Box
                sx={{
                    bgcolor: theme.palette.primary.main,
                    height: "100%",
                    margin: 0,
                    padding: 0,
                }}
            >
                <Typography variant="h6" sx={{ p: 2, color: "white" }}>
                    Edit Profile
                </Typography>
            </Box>
            <Box
                sx={{
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <TextField
                    name="name"
                    type="text"
                    variant="outlined"
                    label="Name"
                    value={name}
                    id={`${user._id}-name`}
                    required
                    onChange={handleChange}
                    autoFocus
                    sx={{ p: 1 }}
                />
                <TextField
                    name="email"
                    type="email"
                    required
                    onChange={handleChange}
                    variant="outlined"
                    label="Email address"
                    value={email}
                    id={`${user._id}-email`}
                    sx={{ p: 1 }}
                />
                <TextField
                    name="currentPassword"
                    type="password"
                    required
                    onChange={handleChange}
                    variant="outlined"
                    label="Current Password"
                    value={currentPassword}
                    id={`${user._id}-password`}
                    sx={{ p: 1 }}
                />
                <TextField
                    name="newPassword"
                    type="password"
                    required
                    onChange={handleChange}
                    variant="outlined"
                    label="New Password"
                    value={newPassword}
                    id={`${user._id}-confirm-password`}
                    sx={{ p: 1 }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        type="submit"
                        onClick={handleSubmit}
                        sx={{
                            bgcolor: theme.palette.secondary.main,
                            marginRight: 2,
                        }}
                    >
                        Update
                    </Button>
                    <Button onClick={handleClose} variant="contained">
                        Cancel
                    </Button>
                </Box>
            </Box>
        </TransitionModal>
    );
};

export default EditProfile;
