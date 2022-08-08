import React from "react";
import { Alert, AlertTitle, Box } from "@mui/material";
import { useSelector } from "react-redux";
import useMediaQuery from "@mui/material/useMediaQuery";
const Notification = () => {
    const { message, type, title } = useSelector((state) => state.notification);
    const mobileScreen = useMediaQuery("(max-width:900px)");

    return (
        <>
            {message ? (
                <Box
                    sx={{
                        zIndex: 10000,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "40px",
                        alignItems: "center",
                        position: "fixed",
                    }}
                >
                    <Alert
                        sx={{ width: mobileScreen ? "80vw" : "40vw" }}
                        variant="filled"
                        severity={type}
                    >
                        <AlertTitle>{title}</AlertTitle>
                        {message}
                    </Alert>
                </Box>
            ) : (
                <></>
            )}
        </>
    );
};

export default Notification;
