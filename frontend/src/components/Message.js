import React from "react";
import { Box, Card, Typography } from "@mui/material";
import getTime from "../utils/getTime";
const Message = ({ message, theme }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent:
                    message.party === "sender" ? "flex-end" : "flex-start",
                margin: "20px",
            }}
        >
            <Card
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexDirection: "column",
                    minWidth: "30px",
                    padding: "5px 10px 0px 10px",
                    color: message.party === "sender" ? "black" : "white",
                    bgcolor:
                        message.party === "sender"
                            ? theme.palette.grey[300]
                            : "#2196f3",
                    overflowWrap: "break-word",
                    maxWidth: "40%",
                }}
                style={
                    message.party === "sender"
                        ? {
                              borderTopLeftRadius: "10px",
                              borderBottomLeftRadius: "10px",
                              borderBottomRightRadius: "0px",
                              borderTopRightRadius: "10px",
                          }
                        : {
                              borderTopLeftRadius: "10px",
                              borderBottomRightRadius: "10px",
                              borderBottomLeftRadius: "0px",
                              borderTopRightRadius: "10px",
                          }
                }
            >
                {message.type === "Text" && (
                    <Typography variant="body1">{message.message}</Typography>
                )}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            message.party === "sender"
                                ? "flex-end"
                                : "flex-start",
                    }}
                >
                    <Typography
                        variant="caption"
                        color={
                            message.party === "sender"
                                ? theme.palette.grey[500]
                                : "white"
                        }
                    >
                        {getTime(message.date)}
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
};

export default Message;
