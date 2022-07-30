import {
    Box,
    Card,
    CardActionArea,
    Avatar,
    Typography,
    IconButton,
    Tooltip,
    Divider,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addChat, getAllUsers } from "../redux/actions/actions";

import Searchbar from "./Searchbar";
import TransitionModal from "./TransitionModal";
import stringToColor from "../utils/stringToColor";

import AddCommentIcon from "@mui/icons-material/AddComment";
import { useTheme } from "@emotion/react";
function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
            marginRight: "5px",
            color: "white",
        },
        children: `${name.split(" ")[0][0]}`,
    };
}

const UsersModalWindow = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const { userslist } = useSelector((state) => state.allusers);
    useEffect(() => {
        if (!userslist) {
            dispatch(getAllUsers());
        }
    }, [userslist, dispatch]);

    const handleAddClick = (user) => {
        console.log(user);
        dispatch(addChat(user));
        handleClose();
    };
    const theme = useTheme();
    return (
        <TransitionModal
            open={open}
            handleClose={handleClose}
            customStyle={{ width: 400 }}
        >
            <Box
                sx={{
                    bgcolor: theme.palette.primary.main,
                    height: "100%",
                    margin: 0,
                    padding: 0,
                }}
            >
                <Typography sx={{ color: "white", p: 2 }} variant="h6">
                    Contacts:
                </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
                <Searchbar />
            </Box>
            <Divider />
            <br />
            <Box
                sx={{
                    height: "30vh",
                    overflowY: "scroll",
                    p: 1,
                }}
                className="scrollbar"
            >
                {userslist && userslist.length
                    ? userslist.map((user) => (
                          <Card
                              key={user._id}
                              elevation={1}
                              sx={{
                                  width: "300px",
                                  height: "80px",
                                  padding: "15px",
                                  margin: "5px",
                                  marginLeft: "30px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                              }}
                          >
                              <CardActionArea
                                  sx={{
                                      height: "100%",
                                      width: "80%",
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      alignItems: "center",
                                  }}
                              >
                                  <Box>
                                      {user.avatar ? (
                                          <Avatar
                                              src={user.avatar}
                                              sx={{ marginRight: "5px" }}
                                          />
                                      ) : (
                                          <Avatar
                                              {...stringAvatar(user.name)}
                                          />
                                      )}
                                  </Box>
                                  <Box>
                                      <Typography variant="body1">
                                          {user.name}
                                      </Typography>
                                  </Box>
                              </CardActionArea>
                              <Box>
                                  <IconButton
                                      onClick={(e) => handleAddClick(user)}
                                  >
                                      <Tooltip title={"Chat"} placement="right">
                                          <AddCommentIcon color="primary" />
                                      </Tooltip>
                                  </IconButton>
                              </Box>
                          </Card>
                      ))
                    : ""}
            </Box>
            <br />
            <Divider />
        </TransitionModal>
    );
};

export default UsersModalWindow;
