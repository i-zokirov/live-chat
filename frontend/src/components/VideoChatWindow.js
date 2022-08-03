import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    TextField,
    IconButton,
    Tooltip,
    LinearProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { loadMessages } from "../redux/actions/actions";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ImageIcon from "@mui/icons-material/Image";
import Message from "./Message";
import { ADD_MESSAGE, LOAD_MESSAGES_RESET } from "../redux/constants/constants";
import socket from "../socket";
const VideoChatWindow = () => {
    const [inputValue, setinputValue] = useState("");
    const theme = useTheme();
    const dispatch = useDispatch();
    const bottomRef = useRef(null);

    const messagesRepo = useSelector((state) => state.messages);
    const { data: currentUserData } = useSelector((state) => state.auth);
    const { loading: messagesLoading, messages } = useSelector(
        (state) => state.loadMessages
    );
    const { data: currentChat } = useSelector((state) => state.currentChat);

    useEffect(() => {
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
        if (currentChat) {
            dispatch(loadMessages(currentChat._id));
        }
    }, [currentChat, dispatch]);

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
    }, [messages, dispatch, currentChat]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messagesRepo, currentChat]);
    const inputIconColor =
        theme.palette.mode === "dark"
            ? theme.palette.primary.main
            : theme.palette.grey[700];

    const inputValueChange = (e) => {
        setinputValue(e.target.value);
    };
    const handleSendMessage = () => {
        socket.emit(
            "message:create",
            {
                to: currentChat._id,
                from: currentUserData._id,
                senderName: currentUserData.name,
                message: inputValue,
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
                                message: inputValue,
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
        setinputValue("");
    };
    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    return (
        <>
            <Box sx={{ height: "92vh", overflow: "hidden none" }}>
                {messagesLoading && <LinearProgress />}
                <Box
                    sx={{
                        height: "90%",
                        overflowY: "scroll",
                        bgcolor:
                            theme.palette.mode === "light"
                                ? "white"
                                : "#263238",
                        borderLeft:
                            theme.palette.mode === "light"
                                ? `1px solid ${theme.palette.grey[100]}`
                                : "none",
                    }}
                    className="scrollbar"
                >
                    {currentChat &&
                    messagesRepo[currentChat._id] &&
                    messagesRepo[currentChat._id].length
                        ? messagesRepo[currentChat._id].map(
                              (message, index) => (
                                  <Message
                                      message={message}
                                      theme={theme}
                                      key={index}
                                      useCalls={false}
                                  />
                              )
                          )
                        : ""}
                    <div ref={bottomRef} />
                </Box>
                <Box
                    sx={{
                        height: "10%",
                        bgcolor:
                            theme.palette.mode === "light"
                                ? theme.palette.grey[100]
                                : theme.palette.primary.black[900],
                        padding: "5px",
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                    }}
                >
                    <IconButton sx={{ width: 40, height: 40 }}>
                        <Tooltip title="Attach file" placement="top">
                            <AttachFileIcon
                                sx={{
                                    color: inputIconColor,
                                }}
                            />
                        </Tooltip>
                    </IconButton>
                    <IconButton sx={{ width: 40, height: 40 }}>
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
                        sx={{ width: "65%" }}
                        multiline
                        maxRows={1}
                    />
                    <IconButton
                        type="submit"
                        onClick={handleSendMessage}
                        sx={{ width: 40, height: 40 }}
                    >
                        <SendIcon sx={{ color: "secondary.main" }} />
                    </IconButton>
                </Box>
            </Box>
        </>
    );
};

export default VideoChatWindow;
