import {
    Box,
    Avatar,
    IconButton,
    Tooltip,
    Divider,
    Typography,
    Paper,
    TextField,
    Card,
    OutlinedInput,
    InputLabel,
    FormControl,
    InputAdornment,
    Input,
} from "@mui/material";
import React, { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import CallIcon from "@mui/icons-material/Call";
import { useTheme } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import getTime from "../utils/getTime";
import { useSelector } from "react-redux";
import stringToColor from "../utils/stringToColor";
import Picker from "emoji-picker-react";

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
    chatId,
    showEmoji,
    setShowEmoji,
    onEmojiClick,
    toggleEmoji,
}) => {
    const theme = useTheme();
    const messagesRepo = useSelector((state) => state.messages);

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            <Box sx={{ margin: 0, padding: 0 }}>
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

                        <Typography variant="body1">
                            {currentChat.name}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            width: "200px",
                        }}
                    >
                        <IconButton size="large">
                            <Tooltip title="Videocall">
                                <VideoCameraFrontIcon
                                    sx={{
                                        color: `${
                                            theme.palette.mode === "light"
                                                ? "primary.main"
                                                : "white"
                                        }`,
                                    }}
                                />
                            </Tooltip>
                        </IconButton>
                        <IconButton size="large">
                            <Tooltip title="Call">
                                <CallIcon
                                    sx={{
                                        color: `${
                                            theme.palette.mode === "light"
                                                ? "primary.main"
                                                : "white"
                                        }`,
                                    }}
                                />
                            </Tooltip>
                        </IconButton>
                    </Box>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        minHeight: "70vh",
                        // maxHeight: "70vh",
                        height: "auto",
                        bgColor: theme.palette.grey[500],
                        display: "flex",
                        flexDirection: "column",
                        borderBottom: "0.5px solid #bdbdbd",
                    }}
                    style={{ overflow: "scroll", overflowX: "hidden" }}
                    className="scrollbar"
                >
                    {messagesRepo[currentChat._id] &&
                    messagesRepo[currentChat._id].length
                        ? messagesRepo[currentChat._id].map(
                              (message, index) => (
                                  <Box
                                      sx={{
                                          display: "flex",
                                          justifyContent:
                                              message.type === "sender"
                                                  ? "flex-end"
                                                  : "flex-start",
                                          margin: "20px",
                                      }}
                                      key={index}
                                  >
                                      <Card
                                          sx={{
                                              display: "flex",
                                              justifyContent: "flex-start",
                                              flexDirection: "column",
                                              minWidth: "30px",
                                              padding: "5px 10px 0px 10px",
                                              color:
                                                  message.type === "sender"
                                                      ? "black"
                                                      : "white",
                                              bgcolor:
                                                  message.type === "sender"
                                                      ? theme.palette.grey[300]
                                                      : "#2196f3",
                                              overflowWrap: "break-word",
                                              maxWidth: "40%",
                                          }}
                                          style={
                                              message.type === "sender"
                                                  ? {
                                                        borderTopLeftRadius:
                                                            "10px",
                                                        borderBottomLeftRadius:
                                                            "10px",
                                                        borderBottomRightRadius:
                                                            "0px",
                                                        borderTopRightRadius:
                                                            "10px",
                                                    }
                                                  : {
                                                        borderTopLeftRadius:
                                                            "10px",
                                                        borderBottomRightRadius:
                                                            "10px",
                                                        borderBottomLeftRadius:
                                                            "0px",
                                                        borderTopRightRadius:
                                                            "10px",
                                                    }
                                          }
                                      >
                                          <Typography variant="body2">
                                              {message.text}
                                          </Typography>
                                          <Box
                                              sx={{
                                                  display: "flex",
                                                  justifyContent:
                                                      message.type === "sender"
                                                          ? "flex-end"
                                                          : "flex-start",
                                              }}
                                          >
                                              <Typography
                                                  variant="caption"
                                                  color={
                                                      message.type === "sender"
                                                          ? theme.palette
                                                                .grey[500]
                                                          : "white"
                                                  }
                                              >
                                                  {getTime(message.date)}
                                              </Typography>
                                          </Box>
                                      </Card>
                                  </Box>
                              )
                          )
                        : ""}
                </Paper>

                <Box sx={{ height: "8vh" }}>
                    <Paper
                        elevation={0}
                        sx={{
                            padding: "20px",
                            display: "flex",
                            justifyContent: "space-between",
                            bgColor: theme.palette.grey[500],
                        }}
                    >
                        <IconButton>
                            <AttachFileIcon
                                sx={{ color: theme.palette.grey[700] }}
                            />
                        </IconButton>

                        <FormControl sx={{ width: "85%" }} variant="outlined">
                            <Input
                                id="outlined-adornment-user-text"
                                type={"text"}
                                value={inputValue}
                                onChange={inputValueChange}
                                onKeyDown={handleKeyDown}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle emoji screen visibility"
                                            edge="end"
                                            onClick={toggleEmoji}
                                        >
                                            <SentimentSatisfiedAltIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label=""
                            />
                        </FormControl>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <IconButton
                                type="submiy"
                                onClick={handleSendMessage}
                            >
                                <SendIcon sx={{ color: "secondary.main" }} />
                            </IconButton>
                        </Box>
                    </Paper>
                </Box>
            </Box>
            {showEmoji && (
                <Picker
                    onEmojiClick={onEmojiClick}
                    style={{ zIndex: 10000 }}
                    pickerStyle={{ zIndex: 10000, bottom: 400, right: 0 }}
                />
            )}
        </>
    );
};

export default ChatWindow;
