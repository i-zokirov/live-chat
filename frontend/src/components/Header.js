import React from 'react'
import { Box, Typography } from "@mui/material";
import ToggleColorMode from "./ToggleColorMode";
const Header = ({title}) => {
  return (
      <Box
          sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "10vh",
              borderBottom: "0.5px solid #bdbdbd",
          }}
      >
          <Typography variant="h6" sx={{ margin: "20px", fontWeight: 700 }}>
              {title}
          </Typography>
          <ToggleColorMode />
      </Box>
  );
}

export default Header