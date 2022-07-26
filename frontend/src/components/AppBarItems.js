import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import ArchiveIcon from "@mui/icons-material/Archive";
import LogoutIcon from "@mui/icons-material/Logout";
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
            title: "Messages",
            name: "Messages",
            icon: <MarkEmailUnreadIcon />,
            action: handleAppBarClick,
        },
        {
            title: "Archive",
            name: "Archive",
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
        </Box>
    );
};

export default AppBarItems;
