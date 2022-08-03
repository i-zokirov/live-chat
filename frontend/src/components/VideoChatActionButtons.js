import React from "react";
import { IconButton, Tooltip, Box, Container } from "@mui/material";

import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import CancelIcon from "@mui/icons-material/Cancel";

const iconBtn = {
    width: "60px",
    height: "60px",
    marginRight: "10px",
};
const icon = {
    width: "35px",
    height: "35px",
};
const VideoChatActionButtons = ({
    header,
    disableCamera,
    toggleCamera,
    muteMic,
    toggleMic,
    handleEndCall,
}) => {
    return (
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
                    <Tooltip
                        title={
                            disableCamera ? "Turn off camera" : "Turn on camera"
                        }
                        placement="top"
                    >
                        <IconButton sx={iconBtn} onClick={toggleCamera}>
                            {disableCamera ? (
                                <VideocamOffIcon
                                    sx={{
                                        ...icon,
                                    }}
                                />
                            ) : (
                                <VideocamIcon
                                    sx={{
                                        ...icon,
                                    }}
                                />
                            )}
                        </IconButton>
                    </Tooltip>
                    <Tooltip
                        title={
                            muteMic
                                ? "Turn on Microphone"
                                : "Turn off Microphone"
                        }
                        placement="top"
                    >
                        <IconButton sx={iconBtn} onClick={toggleMic}>
                            {muteMic ? (
                                <MicOffIcon
                                    sx={{
                                        ...icon,
                                    }}
                                />
                            ) : (
                                <MicIcon
                                    sx={{
                                        ...icon,
                                    }}
                                />
                            )}
                        </IconButton>
                    </Tooltip>
                </Box>

                <Box>
                    <IconButton sx={iconBtn} onClick={handleEndCall}>
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
    );
};

export default VideoChatActionButtons;
