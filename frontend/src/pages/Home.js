import React, { useEffect, useState } from "react";

// MUI Stuff
import { Grid, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import FaceIcon from "@mui/icons-material/Face";
import useMediaQuery from "@mui/material/useMediaQuery";

// CUSTOM COMPONENTS
import Header from "../components/Header";
import Chats from "../components/Chats";
import ChatProfile from "../components/ChatProfile";
import User from "../components/User";
import AppBarItems from "../components/AppBarItems";
import ChatWindow from "../components/ChatWindow";
import Logo from "../components/Logo";
import MyStatus from "../components/MyStatus";
import ActionMenu from "../components/ActionMenu";
import Searchbar from "../components/Searchbar";
import EditProfile from "../components/EditProfile";
import Notification from "../components/Notification";

// Redux stuff
import { ADD_MESSAGE } from "../redux/constants/constants";
import {
    getDMs,
    logoutUser,
    deleteChatAction,
    archiveChatAction,
    getArchivedChats,
    loadMessagesWS,
    sendMessageWS,
    getDMsWS,
} from "../redux/actions/actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import socket from "../socket";
import searchContact from "../utils/contactSearchAlgorithm";

import SideBarMenu from "../components/SideBarMenu";
import MobileAppBar from "../components/MobileAppBar";
import HomePlaceHolder from "../components/HomePlaceHolder";

const Home = () => {
    const [message, setMessage] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [status, setStatus] = useState("Available");
    const [activeChats, setActiveChats] = useState([]);
    const [archivedChatList, setArchivedChatList] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [profileAnchor, setProfileAnchor] = useState(null);
    const [openEditProfile, setOpenEditProfile] = useState(false);
    const [currentWindow, setCurrentWindow] = useState("Chats");
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const openProfileMenu = Boolean(profileAnchor);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();

    const mobileScreen = useMediaQuery("(max-width:900px)");

    const { tokenVerified, data: currentUserData } = useSelector(
        (state) => state.auth
    );
    const { contactlist, loading } = useSelector((state) => state.contacts);

    const { archivedChats, loading: archivedChatsLoading } = useSelector(
        (state) => state.archived
    );

    const { newChat } = useSelector((state) => state.addChat);
    const loadedChats = useSelector((state) => state.loadedChats);

    useEffect(() => {
        if (!contactlist && tokenVerified) {
            dispatch(getDMsWS());
        }
    }, []);

    useEffect(() => {
        if (currentWindow === "Archived Chats") {
            if (!archivedChats && tokenVerified) {
                dispatch(getArchivedChats());
            }
        }

        if (archivedChats && archivedChats.length) {
            setArchivedChatList(archivedChats);
        }
    }, [currentWindow, archivedChats]);

    useEffect(() => {
        setActiveChats(contactlist);
    }, [contactlist]);

    useEffect(() => {
        socket.emit("connection", () => {
            console.log("connection");
        });
        socket.emit("add-user", currentUserData._id);
        socket.on("message:created", (data) => {
            const lastmessageId = localStorage.getItem("lastmessageId");

            if (lastmessageId !== data.messageId) {
                dispatch({
                    type: ADD_MESSAGE,
                    payload: {
                        messageData: [
                            {
                                type: data.type,
                                message: data.message,
                                party: "recipient",
                                senderName: data.senderName,
                                date: data.date,
                            },
                        ],
                        chatId: data.chatId,
                    },
                });
                localStorage.setItem("lastmessageId", data.messageId);
            }
        });

        socket.on("DMs:updated", () => {
        
            if (tokenVerified) {
                dispatch(getDMsWS());
            }
        });
    }, []);

    useEffect(() => {
        if (newChat) {
            setCurrentChat(newChat);
        }
    }, [newChat]);

    useEffect(() => {
        if (currentChat && !loadedChats.includes(currentChat._id)) {
            dispatch(loadMessagesWS(currentChat._id));
        }
    }, [currentChat]);

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
        if (message) {
            dispatch(sendMessageWS(currentChat, message));
            setMessage("");
        }
    };

    const handleCall = (callType) => {
        dispatch(sendMessageWS(currentChat, "", "Call", { callType }));
    };

    // manages current chat window
    const handleCurrentChat = (contact) => {
        localStorage.setItem("currentChat", JSON.stringify(contact));
        setCurrentChat(contact);
    };

    // search filter above active chats
    const handleSearchFilter = (e) => {
        if (currentWindow === "Chats") {
            setActiveChats(searchContact(contactlist, e.target.value));
        } else if (currentWindow === "Archived Chats") {
            setArchivedChatList(searchContact(archivedChats, e.target.value));
        }
    };

    // function to archive chat
    const archiveChat = (contact) => {
        console.log("archive");
        dispatch(archiveChatAction(contact));
        setCurrentChat(null);
    };

    // function to delete chat
    const deleteChat = (contact) => {
        if (contact) {
            dispatch(deleteChatAction(contact));
            if (currentChat._id === contact._id) {
                setCurrentChat(null);
            }
        }
    };

    const handleBackClick = () => {
        setCurrentChat(null);
    };

    // function to logout
    const handleLogout = () => {
        dispatch(logoutUser());
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
        setCurrentChat(null);
        setCurrentWindow(e.currentTarget.name);
    };

    const redirectToAvatarPage = () => {
        navigate("/choose-avatar");
    };

    const toggleSideMenu = (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setOpenSideMenu((prev) => !prev);
    };

    const profileMenuItems = [
        {
            label: "Set Avatar",
            icon: <FaceIcon />,
            action: redirectToAvatarPage,
        },
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
        <>
            <Notification />
            <Box
                sx={{
                    height: "100vh",
                    overflow: "hidden",
                }}
            >
                {mobileScreen && (
                    <>
                        <MobileAppBar
                            toggleSideMenu={toggleSideMenu}
                            handleAppBarClick={handleAppBarClick}
                            currentWindow={currentWindow}
                            selectedColor={
                                theme.palette.mode === "light"
                                    ? theme.palette.secondary.main
                                    : theme.palette.primary.main
                            }
                        />
                        <SideBarMenu
                            toggleSideMenu={toggleSideMenu}
                            openSideMenu={openSideMenu}
                            currentUserData={currentUserData}
                            profileMenuItems={profileMenuItems}
                            status={status}
                            setStatus={setStatus}
                        />
                    </>
                )}
                <Grid container spacing={0}>
                    {!mobileScreen && (
                        <Grid
                            item
                            lg={0.8}
                            md={0.8}
                            sx={{ borderRight: "0.5px solid #bdbdbd" }}
                        >
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
                    )}

                    <Grid
                        item
                        xs={12}
                        md={5.2}
                        lg={2.5}
                        sx={{
                            borderRight: "0.5px solid #bdbdbd",
                            display: mobileScreen && currentChat ? "none" : "",
                        }}
                    >
                        <Box>
                            <Header title={currentWindow} />

                            {currentWindow === "Chats" ? (
                                <>
                                    <Searchbar
                                        handleChange={handleSearchFilter}
                                    />
                                    <Chats
                                        contactlist={activeChats}
                                        currentChat={currentChat}
                                        handleCurrentChat={handleCurrentChat}
                                        deleteChat={deleteChat}
                                        archiveChat={archiveChat}
                                        loading={loading}
                                        useArchived={false}
                                    />
                                </>
                            ) : (
                                currentWindow === "Archived Chats" && (
                                    <>
                                        <Searchbar
                                            handleChange={handleSearchFilter}
                                        />
                                        <Chats
                                            contactlist={archivedChatList}
                                            currentChat={currentChat}
                                            handleCurrentChat={
                                                handleCurrentChat
                                            }
                                            deleteChat={deleteChat}
                                            archiveChat={archiveChat}
                                            loading={archivedChatsLoading}
                                            useArchived={true}
                                        />
                                    </>
                                )
                            )}
                        </Box>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={6}
                        lg={6.2}
                        sx={{
                            borderRight: "0.5px solid #bdbdbd",
                            margin: 0,
                            padding: 0,
                        }}
                    >
                        {currentChat ? (
                            <ChatWindow
                                handleCall={handleCall}
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
                                handleBackClick={handleBackClick}
                            />
                        ) : (
                            !mobileScreen && <HomePlaceHolder />
                        )}
                    </Grid>

                    {!mobileScreen && (
                        <Grid item md={2.5} lg={2.5}>
                            <MyStatus status={status} setStatus={setStatus} />

                            {currentChat && (
                                <ChatProfile currentChat={currentChat} />
                            )}
                        </Grid>
                    )}
                </Grid>
                <ActionMenu
                    items={profileMenuItems}
                    id={"Profile-menu"}
                    open={openProfileMenu}
                    anchorEl={profileAnchor}
                    handleClose={handleProfileMenuViewClose}
                />
                <EditProfile
                    user={currentUserData}
                    open={openEditProfile}
                    handleClose={toggleEditProfileWindow}
                />
            </Box>
        </>
    );
};

export default Home;
