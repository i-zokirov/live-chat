import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
    authUserReducer,
    messagesReducer,
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
