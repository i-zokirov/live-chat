import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import { Typography, Select as MUISelect } from "@mui/material";

const Select = ({ value, setValue, items, minWidth, label }) => {
    const handleChange = (e) => {
        console.log(e.target.value);
        setValue(e.target.value);
    };
    return (
        <Box sx={{ minWidth: minWidth ? minWidth : 120 }}>
            <FormControl fullWidth size="small">
                <InputLabel id={`select-label-${label}`}>{label}</InputLabel>
                <MUISelect
                    labelId={`select-label-${label}`}
                    id="action-select"
                    value={value}
                    label={label}
                    onChange={handleChange}
                >
                    {items.map((item, index) => (
                        <MenuItem key={index} value={item.value}>
                            {item.icon && <Typography>{item.icon}</Typography>}
                            <Typography sx={{ marginLeft: "5px" }}>
                                {item.label}
                            </Typography>
                        </MenuItem>
                    ))}
                </MUISelect>
            </FormControl>
        </Box>
    );
};

export default Select;
