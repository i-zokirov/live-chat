import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import stringToColor from "../utils/stringToColor";

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
            marginRight: "5px",
            color: "white",
            height: 60,
            width: 60,
        },
        children: `${name.split(" ")[0][0]}`,
    };
}

const User = ({ handleProfileMenuView, currentUserData }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "5vh",
                margin: "25px",
                cursor: "pointer",
            }}
            onClick={handleProfileMenuView}
        >
            {currentUserData.avatar ? (
                <Avatar
                    src={currentUserData.avatar}
                    sx={{
                        m: 1,
                        height: 60,
                        width: 60,
                    }}
                />
            ) : (
                <Avatar {...stringAvatar(currentUserData.name)} />
            )}
            <Typography variant="subtitle1">{currentUserData.name}</Typography>
        </Box>
    );
};

export default User;
