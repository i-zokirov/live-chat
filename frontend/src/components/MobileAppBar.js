import { Box, IconButton, Tooltip } from "@mui/material";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ForumIcon from "@mui/icons-material/Forum";
import GroupIcon from "@mui/icons-material/Group";
import ArchiveIcon from "@mui/icons-material/Archive";

import { useTheme } from "@mui/material/styles";
const MobileAppBar = ({
    handleAppBarClick,
    currentWindow,
    selectedColor,
    toggleSideMenu,
}) => {
    const theme = useTheme();
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
    ];

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: theme.palette.primary.main,
                height: "8vh",
                padding: "25px",
            }}
        >
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleSideMenu}
            >
                <MenuIcon sx={{ color: "white" }} />
            </IconButton>

            {appBarIcons.map((item, index) => (
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    key={index}
                    onClick={item.action}
                    name={item.name}
                >
                    <Tooltip
                        title={item.title}
                        sx={{
                            color:
                                currentWindow === item.title
                                    ? theme.palette.secondary.main
                                    : "white",
                        }}
                        placement="bottom"
                    >
                        {item.icon}
                    </Tooltip>
                </IconButton>
            ))}
        </Box>
    );
};

export default MobileAppBar;
