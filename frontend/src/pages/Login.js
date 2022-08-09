import {
    Box,
    Avatar,
    Typography,
    Paper,
    TextField,
    Link,
    Alert,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import React, { useState, useEffect } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link as Router, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { authenticateUser } from "../redux/actions/actions";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleChange = (e) => {
        switch (e.target.name) {
            case "email":
                setEmail(e.target.value);
                return;
            case "password":
                setPassword(e.target.value);
                return;
            default:
                return;
        }
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const location = useLocation();

    const { loading, error, data, tokenVerified } = useSelector(
        (state) => state.auth
    );

    const handleLogin = (e) => {
        if (email && password) {
            dispatch(authenticateUser({ email, password }));
        }
    };

    useEffect(() => {
        if (data) {
            navigate(location.state ? location.state.prevPath : "/chats");
        }
    }, [data]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                background:
                    "linear-gradient(to left bottom, #3f51b5, #8644b0, #ba2c9d, #df007e, #f50057)",
            }}
        >
            <Paper
                elevation={2}
                sx={{
                    minHeight: 400,
                    minWidth: 350,
                    display: "flex",
                    justifyContent: "center",
                    padding: 5,
                }}
            >
                <Box>
                    <Box
                        sx={{
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                            <LockOutlinedIcon sx={{ color: "white" }} />
                        </Avatar>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                    </Box>
                    {error && <Alert severity="error">{error}</Alert>}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ margin: "10px" }}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                onChange={handleChange}
                                value={email}
                                type="email"
                                name="email"
                                autoFocus
                                required
                            />
                        </Box>
                        <Box sx={{ margin: "10px" }}>
                            <TextField
                                label="Password"
                                variant="outlined"
                                onChange={handleChange}
                                value={password}
                                type="password"
                                name="password"
                                required
                            />
                        </Box>

                        <LoadingButton
                            color="secondary"
                            type="submit"
                            loading={loading}
                            loadingPosition="start"
                            variant="contained"
                            startIcon={<VpnKeyIcon />}
                            onClick={handleLogin}
                        >
                            Sign In
                        </LoadingButton>
                    </Box>
                    <Typography variant="caption">
                        No account ?{" "}
                        <Link
                            to="/signup"
                            as={Router}
                            sx={
                                theme.palette.mode === "dark" && {
                                    color: "white",
                                    textDecoration: "underline",
                                }
                            }
                        >
                            Register here
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login;
