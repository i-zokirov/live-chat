import React, { useEffect, useState } from "react";

// MUI Stuff
import { Grid, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";

// CUSTOM COMPONENTS
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import Chats from "../components/Chats";
import User from "../components/User";
import AppBarItems from "../components/AppBarItems";
import ChatWindow from "../components/ChatWindow";
import Logo from "../components/Logo";
import MyStatus from "../components/MyStatus";
import ActionMenu from "../components/ActionMenu";
import TransitionModal from "../components/TransitionModal";
import Searchbar from "../components/Searchbar";
import socket from "../socket";

// Redux stuff
import { ADD_MESSAGE } from "../redux/constants/constants";
import { getContacts } from "../redux/actions/actions";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
    const [message, setMessage] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [status, setStatus] = useState("Offline");

    const [currentChat, setCurrentChat] = useState(
        JSON.parse(localStorage.getItem("currentChat")) || null
    );
    const [profileAnchor, setProfileAnchor] = useState(null);
    const [openEditProfile, setOpenEditProfile] = useState(false);
    const [currentWindow, setCurrentWindow] = useState("Chats");
    const openProfileMenu = Boolean(profileAnchor);

    const dispatch = useDispatch();
    const theme = useTheme();
    const { tokenVerified, data: currentUserData } = useSelector(
        (state) => state.auth
    );
    const { contactlist, loading, error } = useSelector(
        (state) => state.contacts
    );

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

    // toggles emoji window card
    const toggleEmoji = () => {
        setShowEmoji((prev) => !prev);
    };

    const onEmojiClick = (event, emojiObject) => {
        setMessage((prev) => `${prev} ${emojiObject.emoji}`);
    };

    // manages message item
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    // sends message and dispatchs it for corresponding window
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

    // manages current chat window
    const handleCurrentChat = (contact) => {
        localStorage.setItem("currentChat", JSON.stringify(contact));
        setCurrentChat(contact);
    };

    // function to archive chat
    const archiveChat = (contact) => {
        console.log("archive");
        console.log(contact);
    };

    // function to delete chat
    const deleteChat = (contact) => {
        console.log("delete");
        console.log(contact);
    };

    // function to logout
    const handleLogout = () => {
        console.log("Logout");
        if (profileAnchor) {
            setProfileAnchor(null);
        }
    };

    // manages menu on main user icon
    const handleProfileMenuView = (e) => {
        setProfileAnchor(e.currentTarget);
    };

    // closes user icon menu
    const handleProfileMenuViewClose = (e) => {
        setProfileAnchor(null);
    };

    // opens modal for editing user profile
    const editProfile = () => {
        console.log("Edit profile");
        setProfileAnchor(null);
        toggleEditProfileWindow();
    };

    // toggles edit user profile modal
    const toggleEditProfileWindow = () => {
        setOpenEditProfile((prev) => !prev);
    };

    // sets current window
    const handleAppBarClick = (e) => {
        setCurrentWindow(e.currentTarget.name);
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
            }}
        >
            <Grid container spacing={0}>
                <Grid item xs={0.8} sx={{ borderRight: "0.5px solid #bdbdbd" }}>
                    <Logo />
                    <AppBarItems
                        handleAppBarClick={handleAppBarClick}
                        handleLogout={handleLogout}
                        currentWindow={currentWindow}
                        selectedColor={
                            theme.palette.mode === "light"
                                ? theme.palette.primary.main
                                : theme.palette.secondary.main
                        }
                    />

                    <User
                        handleProfileMenuView={handleProfileMenuView}
                        currentUserData={currentUserData}
                    />
                </Grid>
                <Grid item xs={2.7} sx={{ borderRight: "0.5px solid #bdbdbd" }}>
                    <Box>
                        <Header title={currentWindow} />

                        {currentWindow === "Chats" && (
                            <>
                                <Searchbar />
                                <Chats
                                    contactlist={contactlist}
                                    currentChat={currentChat}
                                    handleCurrentChat={handleCurrentChat}
                                    deleteChat={deleteChat}
                                    archiveChat={archiveChat}
                                />
                            </>
                        )}
                    </Box>
                </Grid>

                <Grid
                    item
                    xs={6}
                    sx={{
                        borderRight: "0.5px solid #bdbdbd",
                        margin: 0,
                        padding: 0,
                    }}
                >
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
                            deleteChat={deleteChat}
                            archiveChat={archiveChat}
                        />
                    )}
                </Grid>

                <Grid item xs={2.5}>
                    <Box sx={{ borderBottom: "0.5px solid #bdbdbd" }}>
                        <MyStatus status={status} setStatus={setStatus} />
                    </Box>
                    <Dashboard />
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

export default Home;
