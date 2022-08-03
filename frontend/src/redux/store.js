import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
    addChatReducer,
    addCurrentChatReducer,
    allUsersReducer,
    authUserReducer,
    loadedChatsReducer,
    loadMessagesReducer,
    messagesReducer,
    notificationReducer,
    updateUserReducer,
    userContactsReducer,
    userRegisterReducer,
} from "./reducers/reducers";

const middleware = [thunk];

const allReducers = combineReducers({
    state: (state = {}) => state,
    messages: messagesReducer,
    auth: authUserReducer,
    register: userRegisterReducer,
    contacts: userContactsReducer,
    updateUser: updateUserReducer,
    allusers: allUsersReducer,
    addChat: addChatReducer,
    loadMessages: loadMessagesReducer,
    loadedChats: loadedChatsReducer,
    notification: notificationReducer,
    currentChat: addCurrentChatReducer,
});

const rootReducer = (state, action) => {
    if (action.type === "RESET_APP") {
        state = undefined;
    }
    return allReducers(state, action);
};

// userData from localStorage
const userData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : null;
const initialState = {
    auth: {
        data: userData,
    },
};

const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
