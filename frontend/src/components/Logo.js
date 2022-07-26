import React from "react";
import { Box } from "@mui/material";
import { BiMessageDots } from "react-icons/bi";
const Logo = () => {
    return (
        <Box
            sx={{
                height: "5vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
            }}
        >
            <BiMessageDots
                style={{
                    width: "40px",
                    height: "40px",
                    color: "#f50057",
                }}
            />
        </Box>
    );
};

export default Logo;
