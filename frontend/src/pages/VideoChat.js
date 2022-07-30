import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardMedia,
    IconButton,
    Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import ToggleColorMode from "../components/ToggleColorMode";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import CancelIcon from "@mui/icons-material/Cancel";
import socket, { localhost } from "../socket";
import { useSelector } from "react-redux";
import Peer from "peerjs";
const iconBtn = {
    width: "60px",
    height: "60px",
    marginRight: "10px",
};
const icon = {
    width: "35px",
    height: "35px",
};
const VideCall = () => {
    const [muteMic, setMuteMic] = useState(false);
    const [disableCamera, setDisableCamera] = useState(false);

    const { videochatId } = useParams();
    const { data: currentUserData } = useSelector((state) => state.auth);
    const toggleCamera = () => {
        setDisableCamera((prev) => !prev);
    };

    const toggleMic = () => {
        setMuteMic((prev) => !prev);
    };
    const handleEndCall = () => {
        console.log("End call");
    };
    const remoteVideoRef = useRef(null);
    const currentUserVideoRef = useRef(null);
    const peerInstance = useRef(null);

    useEffect(() => {
        const myPeer = new Peer(currentUserData._id);
        peerInstance.current = myPeer;

        socket.emit("connection", () => {
            console.log("connection");
        });

        myPeer.on("open", (currentPeerId) => {
            console.log("currentpeerId", currentPeerId);
            socket.emit("join-room", {
                videochatId,
                userId: currentPeerId,
            });
        });

        myPeer.on("call", (call) => {
            const getUserMedia = navigator.getUserMedia;
            getUserMedia({ video: true, audio: true }, (stream) => {
                currentUserVideoRef.current.srcObject = stream;

                call.answer(stream);
                call.on("stream", function (remoteStream) {
                    remoteVideoRef.current.srcObject = remoteStream;
                });
            });
        });

        socket.on("user-connected", (userId) => {
            console.log("user-connected", userId);
            connectToNewUser(userId, myPeer);
        });
    }, []);

    const connectToNewUser = (remotePeerId, myPeer) => {
        const getUserMedia = navigator.getUserMedia;
        getUserMedia({ video: true, audio: true }, (stream) => {
            currentUserVideoRef.current.srcObject = stream;

            const remoteCall = myPeer.call(remotePeerId, stream);
            remoteCall.on("stream", (remoteStream) => {
                remoteVideoRef.current.srcObject = remoteStream;
            });
        });
    };

    const theme = useTheme();
    const header = {
        bgcolor:
            theme.palette.mode === "light"
                ? theme.palette.grey[50]
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
                <Typography variant="h6">
                    Video Chat - {currentUserData.name} - {currentUserData._id}
                </Typography>
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
                        <Card
                            sx={{
                                height: "400px",
                                width: "600px",
                                margin: "20px",
                            }}
                        >
                            {/* <CardMedia> */}
                            {currentUserData.name}
                            <video
                                width="500px"
                                height="400px"
                                ref={currentUserVideoRef}
                                onLoadedMetadata={(e) => e.currentTarget.play()}
                            />
                            {/* </CardMedia> */}
                        </Card>
                        <Card
                            sx={{
                                height: "400px",
                                width: "600px",
                                margin: "20px",
                            }}
                        >
                            {/* <CardMedia> */}
                            <video
                                width="500px"
                                height="400px"
                                ref={remoteVideoRef}
                                onLoadedMetadata={(e) => e.currentTarget.play()}
                            />
                            {/* </CardMedia> */}
                        </Card>
                    </Container>
                    <Box
                        sx={{
                            ...header,
                            height: "10%",
                        }}
                    >
                        <Container
                            sx={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Box>
                                <IconButton sx={iconBtn} onClick={toggleCamera}>
                                    {disableCamera ? (
                                        <Tooltip
                                            title="Turn on camera"
                                            placement="top"
                                        >
                                            <VideocamOffIcon
                                                sx={{
                                                    ...icon,
                                                }}
                                            />
                                        </Tooltip>
                                    ) : (
                                        <Tooltip
                                            title="Turn Off camera"
                                            placement="top"
                                        >
                                            <VideocamIcon
                                                sx={{
                                                    ...icon,
                                                }}
                                            />
                                        </Tooltip>
                                    )}
                                </IconButton>
                                <IconButton sx={iconBtn} onClick={toggleMic}>
                                    {muteMic ? (
                                        <Tooltip
                                            title="Turn on Microphone"
                                            placement="top"
                                        >
                                            <MicOffIcon
                                                sx={{
                                                    ...icon,
                                                }}
                                            />
                                        </Tooltip>
                                    ) : (
                                        <Tooltip
                                            title="Turn Off Microphone"
                                            placement="top"
                                        >
                                            <MicIcon
                                                sx={{
                                                    ...icon,
                                                }}
                                            />
                                        </Tooltip>
                                    )}
                                </IconButton>
                            </Box>

                            <Box>
                                <IconButton
                                    sx={iconBtn}
                                    onClick={handleEndCall}
                                >
                                    <Tooltip title="End call" placement="top">
                                        <CancelIcon
                                            sx={{
                                                ...icon,
                                                color: "secondary.main",
                                            }}
                                        />
                                    </Tooltip>
                                </IconButton>
                            </Box>
                        </Container>
                    </Box>
                </Grid>
                <Grid item xs={4}></Grid>
            </Grid>
        </Box>
    );
};

export default VideCall;
