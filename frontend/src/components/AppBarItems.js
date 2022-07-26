import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import GroupIcon from "@mui/icons-material/Group";
import ArchiveIcon from "@mui/icons-material/Archive";
import LogoutIcon from "@mui/icons-material/Logout";
import ToggleColorMode from "./ToggleDarkMode";
const AppBarItems = ({
    handleAppBarClick,
    handleLogout,
    currentWindow,
    selectedColor,
}) => {
    const appBarIcons = [
        {
            title: "Chats",
            name: "Chats",
            icon: <ForumIcon />,
            action: handleAppBarClick,
        },
        {
            title: "Groups",
            name: "Groups",
            icon: <GroupIcon />,
            action: handleAppBarClick,
        },
        {
            title: "Archived Chats",
            name: "Archived Chats",
            icon: <ArchiveIcon />,
            action: handleAppBarClick,
        },
        {
            title: "Logout",
            name: "Logout",
            icon: <LogoutIcon />,
            action: handleLogout,
        },
    ];

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "70vh",
            }}
        >
            {appBarIcons.map((item, index) => (
                <IconButton
                    size="large"
                    sx={{ width: 60, height: 60 }}
                    name={item.name}
                    onClick={item.action}
                    key={index}
                >
                    <Tooltip
                        title={item.title}
                        sx={{
                            color:
                                currentWindow === item.title
                                    ? selectedColor
                                    : "",
                        }}
                        placement="right"
                    >
                        {item.icon}
                    </Tooltip>
                </IconButton>
            ))}

            <ToggleColorMode />
        </Box>
    );
};

export default AppBarItems;
