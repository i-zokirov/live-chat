import { Box, IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ForumIcon from "@mui/icons-material/Forum";
import GroupIcon from "@mui/icons-material/Group";
import ArchiveIcon from "@mui/icons-material/Archive";
import { BiMessageDots } from "react-icons/bi";
const MobileAppBar = ({ handleAppBarClick, currentWindow, toggleSideMenu }) => {
    const appBarIcons = [
        {
            title: "Chats",
            name: "Chats",
            icon: <ForumIcon sx={{ color: "white" }} />,
            action: handleAppBarClick,
        },
        {
            title: "Groups",
            name: "Groups",
            icon: <GroupIcon sx={{ color: "white" }} />,
            action: handleAppBarClick,
        },
        {
            title: "Archived Chats",
            name: "Archived Chats",
            icon: <ArchiveIcon sx={{ color: "white" }} />,
            action: handleAppBarClick,
        },
    ];

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#1565c0",
                height: "9vh",
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
                    sx={{
                        mr: 2,
                    }}
                    key={index}
                    onClick={item.action}
                    name={item.name}
                >
                    <Tooltip title={item.title} placement="bottom">
                        {item.icon}
                    </Tooltip>
                </IconButton>
            ))}

            <BiMessageDots
                style={{
                    width: "30px",
                    height: "30px",
                    color: "white",
                }}
            />
        </Box>
    );
};

export default MobileAppBar;
