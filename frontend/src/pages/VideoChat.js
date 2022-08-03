import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardMedia,
    IconButton,
    Tooltip,
    CardHeader,
    CardContent,
    Paper,
    Avatar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import ToggleColorMode from "../components/ToggleColorMode";
import VideoChatActionButtons from "../components/VideoChatActionButtons";
import VideoChatWindow from "../components/VideoChatWindow";

import socket, { localhost } from "../socket";
import { useDispatch, useSelector } from "react-redux";
import stringAvatar from "../utils/stringAvatar";
import Peer from "peerjs";

import { ADD_CURRENT_CHAT } from "../redux/constants/constants";

const VideCall = () => {
    const [muteMic, setMuteMic] = useState(false);
    const [disableCamera, setDisableCamera] = useState(false);

    const [participants, setParticipants] = useState([]);

    const { videochatId } = useParams();
    const { data: currentUserData } = useSelector((state) => state.auth);
    const remoteVideoRef = useRef(null);
    const currentUserVideoRef = useRef(null);

    const dispatch = useDispatch();
    const myStream = useRef(null);

    const toggleCamera = () => {
        setDisableCamera((prev) => !prev);

        const enabled = myStream.current.getVideoTracks()[0].enabled;
        if (enabled) {
            myStream.current.getVideoTracks()[0].enabled = false;
        } else {
            myStream.current.getVideoTracks()[0].enabled = true;
        }
    };

    const toggleMic = () => {
        setMuteMic((prev) => !prev);
        const enabled = myStream.current.getAudioTracks()[0].enabled;
        if (enabled) {
            myStream.current.getAudioTracks()[0].enabled = false;
        } else {
            myStream.current.getAudioTracks()[0].enabled = true;
        }
    };
    const handleEndCall = () => {
        console.log("End call");
    };

    useEffect(() => {
        const myPeer = new Peer(currentUserData._id);

        socket.emit("connection", () => {
            console.log("connection");
        });
        socket.emit("add-user", currentUserData._id);
        socket.emit("fetch-videochatData", videochatId, function (data) {
            if (data.participants) {
                const remoteUser = [];
                for (let participant of data.participants) {
                    if (participant._id !== currentUserData._id) {
                        remoteUser.push(participant);
                    }
                }
                dispatch({
                    type: ADD_CURRENT_CHAT,
                    payload: remoteUser[0],
                });

                setParticipants(data.participants);
            }
        });

        myPeer.on("open", (currentPeerId) => {
            console.log("currentpeerId", currentPeerId);
            socket.emit("join-room", {
                videochatId,
                user: currentUserData,
            });
        });

        myPeer.on("call", (call) => {
            const getUserMedia = navigator.getUserMedia;
            getUserMedia({ video: true, audio: true }, (mystream) => {
                myStream.current = mystream;
                currentUserVideoRef.current.srcObject = mystream;

                call.answer(mystream);
                call.on("stream", function (remoteStream) {
                    remoteVideoRef.current.srcObject = remoteStream;
                });
            });
        });

        socket.on("user-connected", (user) => {
            console.log("user-connected", user.name);
            connectToNewUser(user._id, myPeer);
        });

        socket.on("user-disconnected", (user) => {
            console.log(user);
        });
    }, []);

    const connectToNewUser = (remotePeerId, myPeer) => {
        const getUserMedia = navigator.getUserMedia;
        getUserMedia({ video: true, audio: true }, (mystream) => {
            currentUserVideoRef.current.srcObject = mystream;
            myStream.current = mystream;
            const remoteCall = myPeer.call(remotePeerId, mystream);
            remoteCall.on("stream", (remoteStream) => {
                remoteVideoRef.current.srcObject = remoteStream;
            });
        });
    };

    const theme = useTheme();
    const header = {
        bgcolor:
            theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.primary.black[900],
    };

    return (
        <Box
            sx={{
                height: "100vh",
            }}
        >
            <Box
                sx={{
                    height: "8vh",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    ...header,
                }}
            >
                <Typography variant="h6">Video Chat</Typography>
                <ToggleColorMode sx={{ width: "200px", ...header }} />
            </Box>
            <Grid
                container
                spacing={0}
                sx={{
                    height: "92vh",
                }}
            >
                <Grid item xs={8} sx={{}}>
                    <Container
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "90%",
                        }}
                    >
                        <Paper
                            sx={{
                                height: "45vh",
                                width: "600px",
                                margin: "20px",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    margin: "5px",
                                    padding: "5px",
                                    overflow: "hidden",
                                }}
                            >
                                {disableCamera ? (
                                    <Box>
                                        {currentUserData.avatar ? (
                                            <Avatar
                                                src={currentUserData.avatar}
                                                sx={{
                                                    m: 1,
                                                    height: 300,
                                                    width: 300,
                                                }}
                                            />
                                        ) : (
                                            <Avatar
                                                {...stringAvatar(
                                                    currentUserData.name,
                                                    300,
                                                    300
                                                )}
                                            />
                                        )}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Typography variant={"h5"}>
                                                {currentUserData.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ) : (
                                    <video
                                        width="90%"
                                        height="90%"
                                        ref={currentUserVideoRef}
                                        onLoadedMetadata={(e) =>
                                            e.currentTarget.play()
                                        }
                                    />
                                )}
                            </Box>
                        </Paper>
                        <Paper
                            sx={{
                                height: "45vh",
                                width: "600px",
                                margin: "20px",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    margin: "5px",
                                    padding: "5px",
                                    overflow: "hidden",
                                }}
                            >
                                <video
                                    width="90%"
                                    height="90%"
                                    ref={remoteVideoRef}
                                    onLoadedMetadata={(e) =>
                                        e.currentTarget.play()
                                    }
                                />
                            </Box>
                        </Paper>
                    </Container>
                    <VideoChatActionButtons
                        header={header}
                        disableCamera={disableCamera}
                        toggleCamera={toggleCamera}
                        muteMic={muteMic}
                        toggleMic={toggleMic}
                        handleEndCall={handleEndCall}
                    />
                </Grid>
                <Grid item xs={4}>
                    <VideoChatWindow />
                </Grid>
            </Grid>
        </Box>
    );
};

export default VideCall;
