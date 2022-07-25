import React from "react";
import { Menu as MUIMenu, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const ActionMenu = ({ open, anchorEl, handleClose, id, items }) => {
    return (
        <MUIMenu
            id={id}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                "aria-labelledby": "basic-button",
            }}
        >
            {items.map((item, index) => (
                <MenuItem
                    key={index}
                    onClick={item.action}
                    sx={{ display: "flex", alignItems: "center" }}
                >
                    {item.icon && <Typography>{item.icon}</Typography>}
                    <Typography sx={{ marginLeft: "5px" }}>
                        {item.label}
                    </Typography>
                </MenuItem>
            ))}
        </MUIMenu>
    );
};

export default ActionMenu;
