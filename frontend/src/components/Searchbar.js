import React from 'react'
import { Box, TextField } from "@mui/material";
const Searchbar = () => {
  return (
      <Box
          sx={{
              margin: "25px 15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
          }}
      >
          <TextField
              size="small"
              variant="outlined"
              label="Search"
              sx={{ width: "100%" }}
          />
      </Box>
  );
}

export default Searchbar