import { Drawer as MUIDrawer } from "@mui/material";
import React from "react";

const Drawer = ({ toggleDrawer, open, children, style }) => {
    return (
        <MUIDrawer
            open={open}
            anchor="left"
            onClose={toggleDrawer}
            sx={{ ...style }}
        >
            {children}
        </MUIDrawer>
    );
};

export default Drawer;
