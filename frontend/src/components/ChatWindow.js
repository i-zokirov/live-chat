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
    Button,
} from "@mui/material";
import React, { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import CallIcon from "@mui/icons-material/Call";
import { useTheme } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";
import getTime from "../utils/getTime";
import { useSelector } from "react-redux";
import stringToColor from "../utils/stringToColor";
import Picker from "emoji-picker-react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ImageIcon from "@mui/icons-material/Image";
import ActionMenu from "./ActionMenu";
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff";
import DirectionsIcon from "@mui/icons-material/Directions";
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
        archiveChat(currentChat);
        handleClose();
    };
    const deleteAction = () => {
        deleteChat(currentChat);
        handleClose();
    };
    const endConversation = () => {
        handleClose();
    };
    const redirectUser = () => {
        handleClose();
    };
    const menuItems = [
        {
            label: "Archive",
            icon: <ArchiveIcon />,
            action: archive,
        },
        {
            label: "End conversation",
            icon: <SpeakerNotesOffIcon />,
            action: endConversation,
        },
        {
            label: "Redirect user",
            icon: <DirectionsIcon />,
            action: redirectUser,
        },
        {
            label: "Delete",
            icon: <DeleteIcon />,
            action: deleteAction,
        },
    ];
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
            <Box sx={{}}>
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
                            width: "200px",
                            marginRight: "20px",
                        }}
                    >
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

                <Paper
                    elevation={0}
                    sx={{
                        minHeight: "70vh",
                        // maxHeight: "70vh",
                        height: "auto",
                        bgcolor:
                            theme.palette.mode === "dark"
                                ? "#263238"
                                : theme.palette.grey[50],
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
                            justifyContent: "space-evenly",
                            bgColor: theme.palette.grey[500],
                        }}
                    >
                        <IconButton>
                            <Tooltip title="Attach file" placement="top">
                                <AttachFileIcon
                                    sx={{
                                        color:
                                            theme.palette.mode === "dark"
                                                ? theme.palette.primary.main
                                                : theme.palette.grey[700],
                                    }}
                                />
                            </Tooltip>
                        </IconButton>
                        <IconButton>
                            <Tooltip title="Upload image" placement="top">
                                <ImageIcon
                                    sx={{
                                        color:
                                            theme.palette.mode === "dark"
                                                ? theme.palette.primary.main
                                                : theme.palette.grey[700],
                                    }}
                                />
                            </Tooltip>
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
                                            <Tooltip
                                                title="Emoji"
                                                placement="top"
                                            >
                                                <SentimentSatisfiedAltIcon />
                                            </Tooltip>
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label=""
                            />
                        </FormControl>
                        {/* <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            
                        </Box> */}
                        <IconButton
                            sx={{ marginLeft: "5px" }}
                            type="submit"
                            onClick={handleSendMessage}
                        >
                            <SendIcon sx={{ color: "secondary.main" }} />
                        </IconButton>
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
            <ActionMenu
                open={openMenu}
                handleClose={handleClose}
                items={menuItems}
                anchorEl={anchorEl}
                it={currentChat._id}
            />
        </>
    );
};

export default ChatWindow;
