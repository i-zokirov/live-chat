import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import stringToColor from "../utils/stringToColor";
function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
            marginRight: "5px",
            color: "white",
            height: 80,
            width: 80,
        },
        children: `${name.split(" ")[0][0]}`,
    };
}

const ChatProfile = ({ currentChat }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "60px"
            }}
        >
            {currentChat.avatar ? (
                <Avatar
                    src={currentChat.avatar}
                    sx={{
                        m: 1,
                        height: 80,
                        width: 80,
                    }}
                />
            ) : (
                <Avatar {...stringAvatar(currentChat.name)} />
            )}

            <Typography
                variant="h6"
                sx={{  fontWeight: 700 }}
            >
                {currentChat.name}
            </Typography>
             <Typography
                variant="subtitle1"
       
            >
                {currentChat.email}
            </Typography>
        </Box>
    );
};

export default ChatProfile;
