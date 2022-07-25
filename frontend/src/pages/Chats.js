import React, { useEffect, useState } from "react";
import {
    Grid,
    Container,
    Paper,
    Card,
    Avatar,
    Typography,
    Divider,
    Box,
    IconButton,
    Tooltip,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import ChatItem from "../components/ChatItem";
import ChatWindow from "../components/ChatWindow";
import socket from "../socket";
import { ADD_MESSAGE } from "../redux/constants/constants";
import { getContacts } from "../redux/actions/actions";
import app_chat from "../assets/app_chat.png";

import stringToColor from "../utils/stringToColor";
import ToggleColorMode from "../components/ToggleColorMode";
import Select from "../components/Select";
import ChatProfile from "../components/ChatProfile";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import AdjustIcon from "@mui/icons-material/Adjust";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTheme } from "@mui/material/styles";
import ActionMenu from "../components/ActionMenu";
import TransitionModal from "../components/TransitionModal";

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
            marginRight: "5px",
            color: "white",
            height: 60,
            width: 60,
        },
        children: `${name.split(" ")[0][0]}`,
    };
}

const statusOptions = [
    {
        label: "Active",
        // icon: <FiberManualRecordIcon sx={{ color: "green" }} />,
        value: "Active",
    },
    {
        label: "Break",
        // icon: <FreeBreakfastIcon sx={{ color: "blue" }} />,
        value: "Break",
    },
    {
        label: "Offline",
        // icon: <AdjustIcon sx={{ color: "red" }} />,
        value: "Offline",
    },
];

const Chats = () => {
    const [message, setMessage] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [status, setStatus] = useState("Offline");

    const [currentChat, setCurrentChat] = useState(
        JSON.parse(localStorage.getItem("currentChat")) || null
    );
    const [profileAnchor, setProfileAnchor] = useState(null);
    const [openEditProfile, setOpenEditProfile] = useState(false);
    const openProfileMenu = Boolean(profileAnchor);

    const dispatch = useDispatch();
    const theme = useTheme();
    const { tokenVerified, data: currentUserData } = useSelector(
        (state) => state.auth
    );
    const { contactlist, loading, error } = useSelector(
        (state) => state.contacts
    );

    const toggleEmoji = () => {
        setShowEmoji((prev) => !prev);
    };

    const onEmojiClick = (event, emojiObject) => {
        setMessage((prev) => `${prev} ${emojiObject.emoji}`);
    };

    useEffect(() => {
        if (!contactlist && tokenVerified) {
            dispatch(getContacts());
        }
    }, []);

    useEffect(() => {
        socket.emit("connection", () => {
            console.log("connection");
        });
        socket.emit("add-user", currentUserData._id);
    }, []);

    let lastmessageId = null;
    useEffect(() => {
        socket.on("receive-message", (data) => {
            if (
                data.senderSocketId !== socket.id &&
                lastmessageId !== data.messageId
            ) {
                dispatch({
                    type: ADD_MESSAGE,
                    payload: {
                        messageData: {
                            text: data.message,
                            type: "receiver",
                            senderName: data.senderName,
                            date: data.date,
                        },
                        chatId: data.chatId,
                    },
                });
                lastmessageId = data.messageId;
            }
        });
    }, []);
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = () => {
        const newmessage = {
            chatId: currentChat._id,
            messageData: {
                text: message,
                type: "sender",
                senderName: currentUserData.name,
                date: new Date(),
            },
        };
        dispatch({
            type: ADD_MESSAGE,
            payload: newmessage,
        });

        socket.emit("send-message", {
            to: currentChat._id,
            from: currentUserData._id,
            senderName: currentUserData.name,
            message,
            senderId: socket.id,
            date: new Date(),
        });
        setMessage("");
    };

    const handleCurrentChat = (contact) => {
        localStorage.setItem("currentChat", JSON.stringify(contact));
        setCurrentChat(contact);
    };

    const archiveChat = (contact) => {
        console.log("archive");
        console.log(contact);
    };
    const deleteChat = (contact) => {
        console.log("delete");
        console.log(contact);
    };

    const handleLogout = () => {
        console.log("Logout");
        if (profileAnchor) {
            setProfileAnchor(null);
        }
    };

    const handleProfileMenuView = (e) => {
        setProfileAnchor(e.currentTarget);
    };

    const handleProfileMenuViewClose = (e) => {
        setProfileAnchor(null);
    };

    const editProfile = () => {
        console.log("Edit profile");
        setProfileAnchor(null);
        toggleEditProfileWindow();
    };

    const toggleEditProfileWindow = () => {
        setOpenEditProfile((prev) => !prev);
    };

    const profileMenuItems = [
        {
            label: "Edit Profile",
            action: editProfile,
            icon: <AccountBoxIcon />,
        },
        {
            label: "Logout",
            action: handleLogout,
            icon: <LogoutIcon />,
        },
    ];

    return (
        <Box
            sx={{
                height: "100vh",
                overflow: "hidden",
                margin: 0,
                padding: 0,
            }}
        >
            <Grid container spacing={3}>
                <Grid item xs={3} sx={{ borderRight: "0.5px solid #bdbdbd" }}>
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
                            <Typography
                                variant="h6"
                                sx={{ margin: "20px", fontWeight: 700 }}
                            >
                                Chats
                            </Typography>
                            <ToggleColorMode />
                        </Box>
                        {/* <Divider /> */}
                        <Box
                            sx={{
                                overflow: "scroll",
                                overflowX: "hidden",
                                minHeight: "70vh",
                                maxHeight: "70vh",
                                borderBottom: "0.5px solid #bdbdbd",
                            }}
                            className="scrollbar"
                        >
                            {contactlist && contactlist.length
                                ? contactlist.map((contact) => (
                                      <ChatItem
                                          contact={contact}
                                          key={contact._id}
                                          selected={
                                              currentChat
                                                  ? currentChat._id ===
                                                    contact._id
                                                      ? true
                                                      : false
                                                  : false
                                          }
                                          handleClick={handleCurrentChat}
                                          deleteChat={deleteChat}
                                          archiveChat={archiveChat}
                                      />
                                  ))
                                : ""}
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "8vh",
                                margin: "25px",
                                cursor: "pointer",
                            }}
                            onClick={handleProfileMenuView}
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
                                <Avatar
                                    {...stringAvatar(currentUserData.name)}
                                />
                            )}
                            <Typography variant="h6">
                                {currentUserData.name}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={6} sx={{ borderRight: "0.5px solid #bdbdbd" }}>
                    {currentChat && (
                        <ChatWindow
                            currentChat={currentChat}
                            inputValue={message}
                            inputValueChange={handleMessageChange}
                            handleSendMessage={handleSendMessage}
                            chatId={currentChat._id}
                            toggleEmoji={toggleEmoji}
                            onEmojiClick={onEmojiClick}
                            showEmoji={showEmoji}
                            setShowEmoji={setShowEmoji}
                        />
                    )}
                </Grid>

                <Grid item xs={3}>
                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                height: "10vh",
                                marginRight: "20px",
                                borderBottom: "0.5px solid #bdbdbd",
                            }}
                        >
                            <Select
                                items={statusOptions}
                                value={status}
                                setValue={setStatus}
                                label={"My Status"}
                                minWidth="200px"
                            />
                            <IconButton onClick={handleLogout}>
                                <Tooltip title="Logout" placement="bottom">
                                    <LogoutIcon
                                        sx={{
                                            color: theme.palette.secondary.main,
                                        }}
                                    />
                                </Tooltip>
                            </IconButton>
                        </Box>

                        <ChatProfile
                            currentChat={currentChat}
                        />
                    </Box>
                </Grid>
            </Grid>
            <ActionMenu
                items={profileMenuItems}
                id={"Profile-menu"}
                open={openProfileMenu}
                anchorEl={profileAnchor}
                handleClose={handleProfileMenuViewClose}
            />
            <TransitionModal
                open={openEditProfile}
                handleClose={toggleEditProfileWindow}
            >
                Hello
            </TransitionModal>
        </Box>
    );
};

export default Chats;
