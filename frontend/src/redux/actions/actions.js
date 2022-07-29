import {
    REGISTER_USER_FAILURE,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    AUTHENTICATE_USER_FAILURE,
    AUTHENTICATE_USER_REQUEST,
    AUTHENTICATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    GET_USER_CONTACTS_FAILURE,
    GET_USER_CONTACTS_REQUEST,
    GET_USER_CONTACTS_SUCCESS,
    GET_ALL_USERS_FAILURE,
    GET_ALL_USERS_REQUEST,
    GET_ALL_USERS_SUCCESS,
    ADD_CHAT_FAILURE,
    ADD_CHAT_REQUEST,
    ADD_CHAT_SUCCESS,
    ADD_CHAT_RESET,
    USER_LOGOUT,
    UPDATE_USER_RESET,
} from "../constants/constants";
import axios from "axios";
import baseUrl from "../../baseUrl";

export const registerUser = (reqbody) => {
    return async (dispatch) => {
        try {
            dispatch({ type: REGISTER_USER_REQUEST });
            const { data } = await axios.post(
                `${baseUrl}/api/users/signup`,
                reqbody
            );

            localStorage.setItem("userData", JSON.stringify(data));

            dispatch({ type: REGISTER_USER_SUCCESS, payload: data });
            dispatch({ type: AUTHENTICATE_USER_SUCCESS, payload: data });
        } catch (error) {
            const err =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            console.log(err);
            dispatch({ type: REGISTER_USER_FAILURE, payload: err });
        }
    };
};

export const authenticateUser = (reqbody) => {
    return async (dispatch) => {
        try {
            dispatch({ type: AUTHENTICATE_USER_REQUEST });
            const { data } = await axios.post(
                `${baseUrl}/api/users/signin`,
                reqbody
            );

            localStorage.setItem("userData", JSON.stringify(data));

            dispatch({ type: AUTHENTICATE_USER_SUCCESS, payload: data });
        } catch (error) {
            const err =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;

            dispatch({ type: AUTHENTICATE_USER_FAILURE, payload: err });
        }
    };
};

export const logoutUser = () => {
    return (dispatch) => {
        localStorage.removeItem("userData");
        dispatch({ type: USER_LOGOUT });
        dispatch({ type: "RESET_APP" });
    };
};

export const verifyToken = () => {
    return async (dispatch, getState) => {
        try {
            const {
                auth: { data: userData },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                },
            };
            const { data } = await axios.get(
                `${baseUrl}/api/users/token`,
                config
            );
            if (data.message === "Verified") {
                dispatch({
                    type: AUTHENTICATE_USER_SUCCESS,
                    payload: userData,
                });
            }
        } catch (error) {
            if (error.response.data.message === "jwt expired") {
                dispatch(logoutUser());
            }
        }
    };
};

export const getDMs = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: GET_USER_CONTACTS_REQUEST });
            const {
                auth: { data: userData },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                },
            };
            const { data } = await axios.get(
                `${baseUrl}/api/users/${userData._id}/dms`,
                config
            );
            dispatch({
                type: GET_USER_CONTACTS_SUCCESS,
                payload: data,
            });
        } catch (error) {
            const err =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            if (err === "jwt expired") {
                dispatch(logoutUser());
            }
            dispatch({ type: GET_USER_CONTACTS_FAILURE, payload: err });
        }
    };
};
export const getAllUsers = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: GET_ALL_USERS_REQUEST });
            const {
                auth: { data: userData },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                },
            };
            const { data } = await axios.get(`${baseUrl}/api/users`, config);
            dispatch({
                type: GET_ALL_USERS_SUCCESS,
                payload: data,
            });
        } catch (error) {
            const err =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            if (err === "jwt expired") {
                dispatch(logoutUser());
            }
            dispatch({ type: GET_ALL_USERS_FAILURE, payload: err });
        }
    };
};
export const addChat = (user) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: ADD_CHAT_REQUEST });
            const {
                auth: { data: currentUser },
            } = getState();

            const {
                contacts: { contactlist },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            };
            const { data } = await axios.put(
                `${baseUrl}/api/users/${currentUser._id}/dms/${user._id}`,
                {},
                config
            );
            console.log(data);
            dispatch({
                type: ADD_CHAT_SUCCESS,
                payload: user,
            });

            if (!contactlist.some((x) => x._id === user._id)) {
                dispatch({
                    type: GET_USER_CONTACTS_SUCCESS,
                    payload: [...contactlist, user],
                });
            }

            setTimeout(() => {
                dispatch({ type: ADD_CHAT_RESET });
            }, 5000);
        } catch (error) {
            const err =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            console.log(err);
            if (err === "jwt expired") {
                dispatch(logoutUser());
            }
            dispatch({ type: ADD_CHAT_FAILURE, payload: err });
        }
    };
};

export const updateUser = (reqbody) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: UPDATE_USER_REQUEST });
            const {
                auth: { data: userData },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                },
            };
            const { data } = await axios.put(
                `${baseUrl}/api/users/${userData._id}`,
                reqbody,
                config
            );
            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: data,
            });

            dispatch({
                type: AUTHENTICATE_USER_SUCCESS,
                payload: { ...userData, avatar: data.avatar },
            });

            localStorage.setItem(
                "userData",
                JSON.stringify({
                    ...userData,
                    avatar: data.avatar,
                })
            );
            setTimeout(() => {
                dispatch({ type: UPDATE_USER_RESET });
            }, 5000);
        } catch (error) {
            const err =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            if (err === "jwt expired") {
                dispatch(logoutUser());
            }
            dispatch({ type: UPDATE_USER_FAILURE, payload: err });
            setTimeout(() => {
                dispatch({ type: UPDATE_USER_RESET });
            }, 5000);
        }
    };
};
