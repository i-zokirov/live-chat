import React from "react";
import {
    Box,
    Card,
    Avatar,
    CardActionArea,
    Typography,
    IconButton,
    Tooltip,
} from "@mui/material";
import stringToColor from "../utils/stringToColor";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
            marginRight: "5px",
            color: "white",
        },
        children: `${name.split(" ")[0][0]}`,
    };
}
const Dashboard = () => {
    const contact = { name: "Jone Doe" };
    return (
        <Box
            sx={{
                marginTop: "20px",
                overflowY: "scroll",
                height: "80vh",
         
            }}
            className="scrollbar"
        >
            <Typography variant="h6" sx={{ fontWeight: 700,        marginLeft: "20px", }}>
                Queue
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Card
                    elevation={0}
                    sx={{
                        height: 50,
                        margin: "10px",
                        // bgcolor: `${selected ? "#f5f5f5" : ""}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <CardActionArea
                        sx={{
                            display: "flex",
                            height: "100%",
                            width: "100%",
                            padding: "20px",
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}
                    >
                        <Box>
                            {contact.avatar ? (
                                <Avatar
                                    src={contact.avatar}
                                    sx={{ marginRight: "5px" }}
                                />
                            ) : (
                                <Avatar {...stringAvatar(contact.name)} />
                            )}
                        </Box>
                        <Box>
                            <Typography
                                variant="body1"
                                // sx={{ color: selected ? "black" : "" }}
                            >
                                {contact.name}
                            </Typography>
                        </Box>
                    </CardActionArea>
                    <Typography>1:20</Typography>
                    <IconButton>
                        <Tooltip title="Accept" placement="top">
                            <CheckCircleOutlineIcon sx={{ color: "green" }} />
                        </Tooltip>
                    </IconButton>
                </Card>
            </Box>
        </Box>
    );
};

export default Dashboard;
