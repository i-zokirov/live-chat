import React, { useContext } from "react";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "../App";

import Box from "@mui/material/Box";
import { Tooltip, IconButton } from "@mui/material";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const ToggleColorMode = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                color: "text.primary",
                borderRadius: 1,
                p: 3,
            }}
        >
            <Tooltip
                placement="right"
                title={
                    theme.palette.mode === "light"
                        ? "Turn on dark mode"
                        : "Turn off dark mode"
                }
            >
                <IconButton
                    size="large"
                    sx={{ width: 60, height: 60 }}
                    onClick={colorMode.toggleColorMode}
                    // color="inherit"
                >
                    {theme.palette.mode === "dark" ? (
                        <Brightness7Icon />
                    ) : (
                        <Brightness4Icon />
                    )}
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default ToggleColorMode;
