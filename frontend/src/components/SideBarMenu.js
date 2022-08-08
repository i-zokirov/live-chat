import React from "react";
import Drawer from "./Drawer";

import {
    Box,
    Avatar,
    Typography,
    Divider,
    MenuList,
    MenuItem,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import stringAvatar from "../utils/stringAvatar";
import ToggleColorMode from "./ToggleColorMode";
import MyStatus from "./MyStatus";

const SideBarMenu = ({
    currentUserData,
    openSideMenu,
    toggleSideMenu,
    profileMenuItems,
    status,
    setStatus,
}) => {
    return (
        <Drawer toggleDrawer={toggleSideMenu} open={openSideMenu}>
            <Box sx={{ width: 250 }}>
                <Box
                    sx={{
                        height: "20vh",
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "15px",
                    }}
                >
                    <Box
                        sx={{
                            marginTop: "10px",
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                        }}
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
                        <Typography variant="body1">
                            {currentUserData.name}
                        </Typography>
                        <Typography variant="body2">
                            {currentUserData.email}
                        </Typography>
                    </Box>
                    <ToggleColorMode
                        sx={{
                            width: "20%",
                            bgcolor: "inherit",
                            margin: "0px",
                            marginTop: "10px",
                            p: 0,
                        }}
                    />
                </Box>
                <Divider />

                <Box sx={{ width: 320, maxWidth: "100%" }}>
                    <MenuList>
                        {profileMenuItems.map((item) => (
                            <MenuItem
                                key={item.label}
                                onClick={item.action}
                                sx={{ marginTop: "15px" }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText>{item.label}</ListItemText>
                            </MenuItem>
                        ))}
                    </MenuList>
                </Box>

                <Divider />

                {/* <Box sx={{ bottom: 40, position: "fixed" }}>
                    <MyStatus status={status} setStatus={setStatus} />
                </Box> */}
            </Box>
        </Drawer>
    );
};

export default SideBarMenu;
