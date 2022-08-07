import React, { useEffect, useState } from "react";

// MUI Stuff
import { Grid, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import FaceIcon from "@mui/icons-material/Face";

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
import socket from "../socket";

// Redux stuff
import { ADD_MESSAGE, LOAD_MESSAGES_RESET } from "../redux/constants/constants";
import {
    getDMs,
    loadMessages,
    logoutUser,
    deleteChatAction,
    archiveChatAction,
    getArchivedChats,
} from "../redux/actions/actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditProfile from "../components/EditProfile";
import Notification from "../components/Notification";
import searchContact from "../utils/contactSearchAlgorithm";

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

    const openProfileMenu = Boolean(profileAnchor);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const { tokenVerified, data: currentUserData } = useSelector(
        (state) => state.auth
    );
    const { contactlist, loading, error } = useSelector(
        (state) => state.contacts
    );

    const { archivedChats, loading: archivedChatsLoading } = useSelector(
        (state) => state.archived
    );

    const { newChat } = useSelector((state) => state.addChat);
    const { messages } = useSelector((state) => state.loadMessages);
    const loadedChats = useSelector((state) => state.loadedChats);
    useEffect(() => {
        if (messages && messages.length) {
            dispatch({
                type: ADD_MESSAGE,
                payload: {
                    chatId: currentChat._id,
                    messageData: messages,
                },
            });

            dispatch({
                type: LOAD_MESSAGES_RESET,
            });
        }
    }, [messages]);

    useEffect(() => {
        if (!contactlist && tokenVerified) {
            dispatch(getDMs());
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
    }, []);

    useEffect(() => {
        if (newChat) {
            setCurrentChat(newChat);
        }
    }, [newChat]);

    useEffect(() => {
        if (currentChat && !loadedChats.includes(currentChat._id)) {
            dispatch(loadMessages(currentChat._id));
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
        socket.emit(
            "message:create",
            {
                to: currentChat._id,
                from: currentUserData._id,
                senderName: currentUserData.name,
                message,
                type: "Text",
                senderSocketId: socket.id,
                date: new Date(),
            },
            (res) => {
                if ("error" in res) {
                    console.log(res);
                } else {
                    const newmessage = {
                        chatId: currentChat._id,
                        messageData: [
                            {
                                type: "Text",
                                message: message,
                                party: "sender",
                                senderName: currentUserData.name,
                                date: new Date(),
                            },
                        ],
                    };
                    dispatch({
                        type: ADD_MESSAGE,
                        payload: newmessage,
                    });
                }
            }
        );
        setMessage("");
    };

    const handleCall = (callType) => {
        console.log("emiting call message");
        const callMessage = {
            to: currentChat._id,
            from: currentUserData._id,
            senderName: currentUserData.name,
            message: "",
            type: "Call",
            senderSocketId: socket.id,
            callType,
            date: new Date(),
        };
        socket.emit("message:create", callMessage, (res) => {
            if (res.error) {
                console.log(res.error);
            } else if (res.data) {
                const { type, date, _id } = res.data;
                const newmessage = {
                    chatId: currentChat._id,
                    messageData: [
                        {
                            type,
                            message: `${currentUserData.name} invited for ${callType} call. Join using this link: - http://localhost:3000/videochat/${_id}`,
                            party: "sender",
                            senderName: currentUserData.name,
                            date,
                        },
                    ],
                };
                dispatch({
                    type: ADD_MESSAGE,
                    payload: newmessage,
                });
            }
        });
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
        setCurrentWindow(e.currentTarget.name);
    };

    const redirectToAvatarPage = () => {
        navigate("/choose-avatar");
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
                <Grid container spacing={0}>
                    <Grid
                        item
                        xs={0.8}
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
                    <Grid
                        item
                        xs={2.7}
                        sx={{ borderRight: "0.5px solid #bdbdbd" }}
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
                        xs={6}
                        sx={{
                            borderRight: "0.5px solid #bdbdbd",
                            margin: 0,
                            padding: 0,
                        }}
                    >
                        {currentChat && (
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
                            />
                        )}
                    </Grid>

                    <Grid item xs={2.5}>
                        <MyStatus status={status} setStatus={setStatus} />

                        {currentChat && (
                            <ChatProfile currentChat={currentChat} />
                        )}
                    </Grid>
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
