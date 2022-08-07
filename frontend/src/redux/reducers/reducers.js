import {
    ADD_MESSAGE,
    REGISTER_USER_FAILURE,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    GET_USER_CONTACTS_FAILURE,
    GET_USER_CONTACTS_REQUEST,
    GET_USER_CONTACTS_SUCCESS,
    GET_ARCHIVED_CHATS_FAILURE,
    GET_ARCHIVED_CHATS_REQUEST,
    GET_ARCHIVED_CHATS_SUCCESS,
    GET_ALL_USERS_FAILURE,
    GET_ALL_USERS_REQUEST,
    GET_ALL_USERS_SUCCESS,
    ADD_CHAT_FAILURE,
    ADD_CHAT_REQUEST,
    ADD_CHAT_SUCCESS,
    AUTHENTICATE_USER_FAILURE,
    AUTHENTICATE_USER_REQUEST,
    AUTHENTICATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    LOAD_MESSAGES_FAILURE,
    LOAD_MESSAGES_REQUEST,
    LOAD_MESSAGES_SUCCESS,
    LOAD_MESSAGES_RESET,
    USER_LOGOUT,
    UPDATE_USER_RESET,
    ADD_CHAT_RESET,
    LOADED_CHATS,
    DISPATCH_NOTIFICATION,
    RESET_NOTIFICATION,
    ADD_CURRENT_CHAT,
    RESET_CURRENT_CHAT,
    DELETE_CHAT_FAILURE,
    DELETE_CHAT_REQUEST,
    DELETE_CHAT_SUCCESS,
    DELETE_CHAT_RESET,
    ARCHIVE_CHAT_FAILURE,
    ARCHIVE_CHAT_REQUEST,
    ARCHIVE_CHAT_SUCCESS,
    ARCHIVE_CHAT_RESET,
} from "../constants/constants";

export const messagesReducer = (state = {}, action) => {
    switch (action.type) {
        case ADD_MESSAGE:
            let newState;
            if (state[action.payload.chatId]) {
                newState = { ...state };
                newState[action.payload.chatId] = [
                    ...state[action.payload.chatId],
                    ...action.payload.messageData,
                ];
            } else {
                newState = { ...state };
                newState[action.payload.chatId] = [
                    ...action.payload.messageData,
                ];
            }
            return newState;
        default:
            return state;
    }
};

export const addCurrentChatReducer = (state = {}, action) => {
    switch (action.type) {
        case ADD_CURRENT_CHAT:
            return {
                data: action.payload,
            };
        case RESET_CURRENT_CHAT:
            return {};
        default:
            return state;
    }
};

export const notificationReducer = (state = {}, action) => {
    switch (action.type) {
        case DISPATCH_NOTIFICATION:
            return {
                type: action.payload.type,
                message: action.payload.message,
                title: action.payload.title,
            };
        case RESET_NOTIFICATION:
            return {};
        default:
            return state;
    }
};

export const loadedChatsReducer = (state = [], action) => {
    switch (action.type) {
        case LOADED_CHATS:
            return [...state, action.payload];
        default:
            return state;
    }
};
export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case REGISTER_USER_REQUEST:
            return {
                loading: true,
            };
        case REGISTER_USER_SUCCESS:
            return {
                loading: false,
                data: action.payload,
            };
        case REGISTER_USER_FAILURE:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const authUserReducer = (state = {}, action) => {
    switch (action.type) {
        case AUTHENTICATE_USER_REQUEST:
            return {
                loading: true,
                tokenVerified: false,
            };
        case AUTHENTICATE_USER_SUCCESS:
            return {
                loading: false,
                data: action.payload,
                tokenVerified: true,
            };
        case AUTHENTICATE_USER_FAILURE:
            return {
                loading: false,
                error: action.payload,
                tokenVerified: false,
            };
        case USER_LOGOUT:
            return {
                loading: false,
                data: null,
                tokenVerified: false,
            };
        default:
            return state;
    }
};

export const userContactsReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_USER_CONTACTS_REQUEST:
            return {
                loading: true,
            };
        case GET_USER_CONTACTS_SUCCESS:
            return {
                loading: false,
                contactlist: action.payload,
            };
        case GET_USER_CONTACTS_FAILURE:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};
export const archivedChatsReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ARCHIVED_CHATS_REQUEST:
            return {
                loading: true,
            };
        case GET_ARCHIVED_CHATS_SUCCESS:
            return {
                loading: false,
                archivedChats: action.payload,
            };
        case GET_ARCHIVED_CHATS_FAILURE:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const allUsersReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ALL_USERS_REQUEST:
            return {
                loading: true,
            };
        case GET_ALL_USERS_SUCCESS:
            return {
                loading: false,
                userslist: action.payload,
            };
        case GET_ALL_USERS_FAILURE:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const addChatReducer = (state = {}, action) => {
    switch (action.type) {
        case ADD_CHAT_REQUEST:
            return {
                loading: true,
            };
        case ADD_CHAT_SUCCESS:
            return {
                loading: false,
                newChat: action.payload,
            };
        case ADD_CHAT_FAILURE:
            return {
                loading: false,
                error: action.payload,
            };
        case ADD_CHAT_RESET:
            return {};
        default:
            return state;
    }
};

export const deleteChatReducer = (state = {}, action) => {
    switch (action.type) {
        case DELETE_CHAT_REQUEST:
            return {
                loading: true,
            };
        case DELETE_CHAT_SUCCESS:
            return {
                loading: false,
                deletedChat: action.payload,
            };
        case DELETE_CHAT_FAILURE:
            return {
                loading: false,
                error: action.payload,
            };
        case DELETE_CHAT_RESET:
            return {};
        default:
            return state;
    }
};

export const archiveChatReducer = (state = {}, action) => {
    switch (action.type) {
        case ARCHIVE_CHAT_REQUEST:
            return {
                loading: true,
            };
        case ARCHIVE_CHAT_SUCCESS:
            return {
                loading: false,
                archivedChat: action.payload,
            };
        case ARCHIVE_CHAT_FAILURE:
            return {
                loading: false,
                error: action.payload,
            };
        case ARCHIVE_CHAT_RESET:
            return {};
        default:
            return state;
    }
};

export const updateUserReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_USER_REQUEST:
            return {
                loading: true,
            };
        case UPDATE_USER_SUCCESS:
            return {
                loading: false,
                data: action.payload,
            };
        case UPDATE_USER_FAILURE:
            return {
                loading: false,
                error: action.payload,
            };
        case UPDATE_USER_RESET:
            return {};
        default:
            return state;
    }
};

export const loadMessagesReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_MESSAGES_REQUEST:
            return {
                loading: true,
            };
        case LOAD_MESSAGES_SUCCESS:
            return {
                loading: false,
                messages: action.payload,
            };
        case LOAD_MESSAGES_FAILURE:
            return {
                loading: false,
                error: action.payload,
            };
        case LOAD_MESSAGES_RESET:
            return {};
        default:
            return state;
    }
};
