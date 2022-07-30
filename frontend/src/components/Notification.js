import React from "react";
import { Alert, AlertTitle,Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

const Notification = () => {
    const {message, type, title} = useSelector(state => state.notification)
    const dispatch = useDispatch()

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
            <Alert sx={{ width: "40vw" }} variant="filled" severity={type}>
                <AlertTitle>{title}</AlertTitle>
                {message}
            </Alert>
        </Box>
        ): <></>}
        </>
        
    );
};

export default Notification;
