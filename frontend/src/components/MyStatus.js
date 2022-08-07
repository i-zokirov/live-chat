import React from "react";
import { Box, Tooltip } from "@mui/material";
import Select from "./Select";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AdjustIcon from "@mui/icons-material/Adjust";
import DoNotDisturbOnTotalSilenceIcon from "@mui/icons-material/DoNotDisturbOnTotalSilence";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
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

const renderIcon = (status) => {
    switch (status) {
        case "Available":
            return (
                <Tooltip title="Available">
                    <FiberManualRecordIcon sx={{ color: "#2e7d32" }} />
                </Tooltip>
            );
        case "Offline":
            return (
                <Tooltip title="Offline">
                    <AdjustIcon sx={{ color: "#f57c00" }} />
                </Tooltip>
            );
        case "Break":
            return (
                <Tooltip title="Break">
                    <FreeBreakfastIcon sx={{ color: "#2196f3" }} />
                </Tooltip>
            );
        case "Busy":
            return (
                <Tooltip title="Busy">
                    <DoNotDisturbOnTotalSilenceIcon sx={{ color: "red" }} />
                </Tooltip>
            );
        default:
            return <></>;
    }
};
const MyStatus = ({ status, setStatus }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                height: "10vh",

                borderBottom: "0.5px solid #bdbdbd",
            }}
        >
            {renderIcon(status)}
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
