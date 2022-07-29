import {
    Box,
    Avatar,
    IconButton,
    Tooltip,
    Typography,
    Paper,
    TextField,
    Button,
} from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import CallIcon from "@mui/icons-material/Call";
import { useTheme } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";

import { useSelector } from "react-redux";
import stringToColor from "../utils/stringToColor";
import Picker from "emoji-picker-react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ImageIcon from "@mui/icons-material/Image";
import ActionMenu from "./ActionMenu";
import BlockIcon from "@mui/icons-material/Block";
import LinearProgress from "@mui/material/LinearProgress";
import Message from "./Message";
function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
            marginRight: "5px",
            color: "white",
            height: 40,
            width: 40,
        },
        children: `${name.split(" ")[0][0]}`,
    };
}

const ChatWindow = ({
    inputValueChange,
    inputValue,
    handleSendMessage,
    currentChat,
    showEmoji,
    setShowEmoji,
    onEmojiClick,
    toggleEmoji,
    archiveChat,
    deleteChat,
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const bottomRef = useRef(null);

    const handleOpenMenuClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const archive = () => {
        archiveChat(currentChat);
        handleClose();
    };
    const deleteAction = () => {
        deleteChat(currentChat);
        handleClose();
    };

    const blocktUser = () => {
        handleClose();
    };
    const menuItems = [
        {
            label: "Archive",
            icon: <ArchiveIcon />,
            action: archive,
        },
        {
            label: "Block user",
            icon: <BlockIcon />,
            action: blocktUser,
        },
        {
            label: "Delete",
            icon: <DeleteIcon />,
            action: deleteAction,
        },
    ];
    const theme = useTheme();
    const messagesRepo = useSelector((state) => state.messages);
    const { loading: messagesLoading } = useSelector(
        (state) => state.loadMessages
    );
    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const mainWindowClick = (e) => {
        if (showEmoji) {
            setShowEmoji(false);
        }
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messagesRepo, currentChat]);

    const inputIconColor =
        theme.palette.mode === "dark"
            ? theme.palette.primary.main
            : theme.palette.grey[700];
    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "10vh",
                    borderBottom: "0.5px solid #bdbdbd",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: "400px",
                        marginLeft: "20px",
                    }}
                >
                    {currentChat.avatar ? (
                        <Avatar
                            src={currentChat.avatar}
                            sx={{
                                m: 1,

                                height: 40,
                                width: 40,
                            }}
                        />
                    ) : (
                        <Avatar {...stringAvatar(currentChat.name)} />
                    )}

                    <Box>
                        <Typography variant="body1">
                            {currentChat.name}
                        </Typography>
                        <Typography variant="body2">
                            {currentChat.email}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        width: "400px",
                        marginRight: "20px",
                    }}
                >
                    <IconButton sx={{ width: 60, height: 60 }}>
                        <Tooltip title="Video call" placement="bottom">
                            <VideoCameraFrontIcon />
                        </Tooltip>
                    </IconButton>
                    <IconButton sx={{ width: 60, height: 60 }}>
                        <Tooltip title="Call" placement="bottom">
                            <CallIcon />
                        </Tooltip>
                    </IconButton>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<MoreHorizIcon />}
                        onClick={handleOpenMenuClick}
                        sx={{ bgcolor: theme.palette.secondary.main }}
                    >
                        Actions
                    </Button>
                </Box>
            </Box>
            {messagesLoading && <LinearProgress color="secondary" />}

            <Box
                sx={{
                    height: "75vh",
                    bgcolor:
                        theme.palette.mode === "dark"
                            ? "#263238"
                            : theme.palette.grey[50],
                    display: "flex",
                    flexDirection: "column",
                    borderBottom: "0.5px solid #bdbdbd",
                    overflow: "scroll",
                    overflowX: "hidden",
                }}
                className="scrollbar"
                onClick={mainWindowClick}
            >
                {messagesRepo[currentChat._id] &&
                messagesRepo[currentChat._id].length
                    ? messagesRepo[currentChat._id].map((message, index) => (
                          <Message
                              message={message}
                              theme={theme}
                              key={index}
                          />
                      ))
                    : ""}
                <div ref={bottomRef} />
            </Box>

            <Box
                sx={{ height: "12.7vh", borderBottom: "0.5px solid #bdbdbd" }}
                onClick={mainWindowClick}
            >
                <Box
                    sx={{
                        padding: "15px",
                        display: "flex",
                        justifyContent: "space-evenly",
                        bgColor: theme.palette.grey[500],
                        // borderBottom: "0.5px solid #bdbdbd",
                    }}
                >
                    <IconButton sx={{ width: 60, height: 60 }}>
                        <Tooltip title="Attach file" placement="top">
                            <AttachFileIcon
                                sx={{
                                    color: inputIconColor,
                                }}
                            />
                        </Tooltip>
                    </IconButton>
                    <IconButton sx={{ width: 60, height: 60 }}>
                        <Tooltip title="Upload image" placement="top">
                            <ImageIcon
                                sx={{
                                    color: inputIconColor,
                                }}
                            />
                        </Tooltip>
                    </IconButton>
                    <TextField
                        placeholder="Start typing ..."
                        variant="outlined"
                        type={"text"}
                        value={inputValue}
                        onChange={inputValueChange}
                        onKeyDown={handleKeyDown}
                        sx={{ width: "70%" }}
                        multiline
                        maxRows={2}
                    />

                    <IconButton
                        aria-label="toggle emoji screen visibility"
                        edge="end"
                        onClick={toggleEmoji}
                        sx={{ width: 60, height: 60 }}
                    >
                        <Tooltip title="Emoji" placement="top">
                            <SentimentSatisfiedAltIcon />
                        </Tooltip>
                    </IconButton>
                    <IconButton
                        type="submit"
                        onClick={handleSendMessage}
                        sx={{ width: 60, height: 60 }}
                    >
                        <SendIcon sx={{ color: "secondary.main" }} />
                    </IconButton>
                </Box>
            </Box>

            {showEmoji && (
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Picker
                        onEmojiClick={onEmojiClick}
                        style={{ zIndex: 10000 }}
                        pickerStyle={{ zIndex: 10000, bottom: 400 }}
                        name="emoji-picker"
                    />
                </Box>
            )}
            <ActionMenu
                open={openMenu}
                handleClose={handleClose}
                items={menuItems}
                anchorEl={anchorEl}
                it={currentChat._id}
            />
        </Box>
    );
};

export default ChatWindow;
