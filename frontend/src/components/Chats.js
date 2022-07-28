import React from "react";
import { Box } from "@mui/material";
import ChatItem from "./ChatItem";
const Chats = ({
    contactlist,
    currentChat,
    handleCurrentChat,
    deleteChat,
    archiveChat,
}) => {
    return (
        <Box
            sx={{
                overflow: "scroll",
                overflowX: "hidden",
                minHeight: "78vh",
                maxHeight: "78vh",
                borderBottom: "0.5px solid #bdbdbd",
            }}
            className="scrollbar"
        >
            {contactlist && contactlist.length
                ? contactlist.map((contact) => (
                      <ChatItem
                          contact={contact}
                          key={contact._id}
                          selected={
                              currentChat
                                  ? currentChat._id === contact._id
                                      ? true
                                      : false
                                  : false
                          }
                          handleClick={handleCurrentChat}
                          deleteChat={deleteChat}
                          archiveChat={archiveChat}
                      />
                  ))
                : ""}
        </Box>
    );
};

export default Chats;
