import React, { createContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import "./App.css";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "./pages/Home";

import ProtectRoute from "./ProtectRoutes";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "./redux/actions/actions";
import ChoosAvatar from "./pages/ChoosAvatar";
const themes = {
    light: {
        palette: {
            mode: "light",
            primary: {
                main: "#3f51b5",
            },
            secondary: {
                main: "#f50057",
            },
        },
    },
    dark: {
        palette: {
            mode: "dark",
            primary: {
                main: "#3f51b5",
            },
            secondary: {
                main: "#f50057",
            },
        },
    },
};

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const App = () => {
    const [mode, setMode] = useState(localStorage.getItem("mode") || "dark");

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    localStorage.setItem(
                        "mode",
                        prevMode === "dark" ? "light" : "dark"
                    );

                    return prevMode === "dark" ? "light" : "dark";
                });
            },
        }),
        []
    );

    const { tokenVerified, data } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (data && !tokenVerified) {
            dispatch(verifyToken());
        }
    }, [tokenVerified, data, dispatch]);

    const theme = useMemo(() => createTheme(themes[mode]), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route path="/signup" element={<Register />} />
                        <Route path="/signin" element={<Login />} />
                        <Route
                            path="/chats"
                            element={
                                <ProtectRoute
                                    redirectPath="/signin"
                                    authenticated={tokenVerified}
                                >
                                    <Home />
                                </ProtectRoute>
                            }
                        />
                        <Route
                            path="/choose-avatar"
                            element={
                                <ProtectRoute
                                    redirectPath="/signin"
                                    authenticated={tokenVerified}
                                >
                                    <ChoosAvatar />
                                </ProtectRoute>
                            }
                        />

                        <Route path="*" element={<Navigate to="/chats" />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default App;
