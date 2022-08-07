import React, { useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ToggleColorMode from "./ToggleColorMode";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import UsersModalWindow from "./UsersModalWindow";
const Header = ({ title }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((prev) => !prev);
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "10vh",
                    borderBottom: "0.5px solid #bdbdbd",
                }}
            >
                <Typography
                    variant="h6"
                    sx={{ margin: "20px", fontWeight: 700 }}
                >
                    {title}
                </Typography>
                {title === "Chats" ? (
                    <IconButton
                        onClick={toggleOpen}
                        sx={{ width: 60, height: 60, marginRight: "20px" }}
                    >
                        <Tooltip title="Add chat" placement="bottom">
                            <PersonAddIcon />
                        </Tooltip>
                    </IconButton>
                ) : title === "Groups" ? (
                    <IconButton
                        sx={{ width: 60, height: 60, marginRight: "20px" }}
                    >
                        <Tooltip
                            title="Add Group chat (not implemented)"
                            placement="bottom"
                        >
                            <GroupAddIcon />
                        </Tooltip>
                    </IconButton>
                ) : (
                    ""
                )}
            </Box>
            <UsersModalWindow open={open} handleClose={toggleOpen} />
        </>
    );
};

export default Header;
