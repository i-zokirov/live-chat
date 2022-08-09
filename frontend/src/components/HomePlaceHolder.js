import React from "react";
import { Box, Typography } from "@mui/material";
import { AiOutlineWechat } from "react-icons/ai";

const HomePlaceHolder = () => {
    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Box sx={{ bgcolor: "#f50057" }}>
                <Typography
                    variant="h2"
                    sx={{ fontWeight: 500, padding: 1, color: "white" }}
                >
                    Live
                </Typography>
            </Box>
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
                Chat
            </Typography>
            <AiOutlineWechat
                style={{ width: "200px", height: "200px", color: "#f50057" }}
            />

            <Typography variant="subtitle1">
                Select or Add a contact to start chatting...
            </Typography>
        </Box>
    );
};

export default HomePlaceHolder;
