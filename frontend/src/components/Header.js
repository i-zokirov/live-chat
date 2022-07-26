import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ToggleColorMode from "./ToggleColorMode";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
const Header = ({ title }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "10vh",
                borderBottom: "0.5px solid #bdbdbd",
            }}
        >
            <Typography variant="h6" sx={{ margin: "20px", fontWeight: 700 }}>
                {title}
            </Typography>
            {title === "Chats" ? (
                <IconButton sx={{ width: 60, height: 60, marginRight: "20px" }}>
                    <Tooltip title="Add chat" placement="bottom">
                        <PersonAddIcon />
                    </Tooltip>
                </IconButton>
            ) : title === "Groups" ? (
                <IconButton sx={{ width: 60, height: 60, marginRight: "20px" }}>
                    <Tooltip title="Add Group chat" placement="bottom">
                        <GroupAddIcon />
                    </Tooltip>
                </IconButton>
            ) : (
                ""
            )}
        </Box>
    );
};

export default Header;
