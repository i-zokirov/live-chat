import React from "react";
import { Box } from "@mui/material";
import Select from "./Select";

const statusOptions = [
    {
        label: "Available",
        value: "Available",
    },
    {
        label: "Break",
        value: "Break",
    },
    {
        label: "Busy",
        value: "Busy",
    },
    {
        label: "Offline",
        value: "Offline",
    },
];

const MyStatus = ({ status, setStatus }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                height: "10vh",
                marginRight: "10px",
                borderBottom: "0.5px solid #bdbdbd",
            }}
        >
            <Select
                items={statusOptions}
                value={status}
                setValue={setStatus}
                label={"My Status"}
                minWidth="200px"
            />
        </Box>
    );
};

export default MyStatus;
