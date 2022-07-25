import React, { useState } from "react";
import {
    Card,
    Avatar,
    Typography,
    IconButton,
    CardActionArea,
    Divider,
} from "@mui/material";
import { Box } from "@mui/system";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useTheme } from "@mui/material/styles";
import stringToColor from "../utils/stringToColor";
import ActionMenu from "./ActionMenu";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";
function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
            marginRight: "5px",
            color: "white",
        },
        children: `${name.split(" ")[0][0]}`,
    };
}
const ChatItem = ({
    selected,
    contact,
    handleClick,
    archiveChat,
    deleteChat,
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleOpenMenuClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const archive = () => {
        archiveChat(contact);
        handleClose();
    };
    const deleteAction = () => {
        deleteChat(contact);
        handleClose();
    };
    const menuItems = [
        {
            label: "Archieve",
            icon: <ArchiveIcon />,
            action: archive,
        },
        {
            label: "Delete",
            icon: <DeleteIcon />,
            action: deleteAction,
        },
    ];

    const theme = useTheme();

    return (
        <>
            <Card
                elevation={0}
                sx={{
                    height: 60,
                    margin: "10px",
                    bgcolor: `${selected ? "#f5f5f5" : ""}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
                onClick={(e) => handleClick(contact)}
            >
                <CardActionArea
                    sx={{
                        display: "flex",
                        height: "100%",
                        width: "80%",
                        padding: "20px",
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}
                >
                    <Box>
                        {contact.avatar ? (
                            <Avatar
                                src={contact.avatar}
                                sx={{ marginRight: "5px" }}
                            />
                        ) : (
                            <Avatar {...stringAvatar(contact.name)} />
                        )}
                    </Box>
                    <Box>
                        <Typography
                            variant="body1"
                            sx={{ color: selected ? "black" : "" }}
                        >
                            {contact.name}
                        </Typography>
                    </Box>
                </CardActionArea>
                <Box>
                    <IconButton onClick={handleOpenMenuClick}>
                        <MoreHorizIcon
                            sx={{ color: selected ? "black" : "" }}
                        />
                    </IconButton>
                </Box>
            </Card>
            <Divider />
            <ActionMenu
                open={openMenu}
                handleClose={handleClose}
                items={menuItems}
                anchorEl={anchorEl}
                it={contact._id}
            />
        </>
    );
};

export default ChatItem;
