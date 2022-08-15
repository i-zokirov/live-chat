import {
    Box,
    Avatar,
    Typography,
    Paper,
    TextField,
    Alert,
    Link,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link as Router, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { registerUser } from "../redux/actions/actions";
const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleChange = (e) => {
        switch (e.target.name) {
            case "name":
                setName(e.target.value);
                return;
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
    const { loading, error } = useSelector((state) => state.register);
    const { data } = useSelector((state) => state.auth);

    const handleRegister = (e) => {
        if (name && email && password) {
            dispatch(registerUser({ name, email, password }));
        }
    };
    useEffect(() => {
        if (data) {
            navigate("/choose-avatar");
        }
    }, [data, navigate]);
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100vh",
                justifyContent: "center",
                background:
                    "linear-gradient(to left bottom, #3f51b5, #8644b0, #ba2c9d, #df007e, #f50057)",
            }}
        >
            <Paper
                elevation={2}
                sx={{
                    minHeight: 400,
                    width: 350,
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
                            Sign up
                        </Typography>
                    </Box>

                    {error && <Alert severity="error">{error}</Alert>}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ margin: "10px" }}>
                            <TextField
                                label="Name"
                                variant="outlined"
                                onChange={handleChange}
                                value={name}
                                type="text"
                                name="name"
                                autoFocus
                                required
                            />
                        </Box>
                        <Box sx={{ margin: "10px" }}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                onChange={handleChange}
                                value={email}
                                type="email"
                                name="email"
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
                            startIcon={<HowToRegIcon />}
                            onClick={handleRegister}
                        >
                            Sign Up
                        </LoadingButton>
                    </Box>
                    <Typography variant="caption">
                        Already have an account ?{" "}
                        <Link
                            as={Router}
                            to="/signin"
                            sx={
                                theme.palette.mode === "dark"
                                    ? {
                                          color: "white",
                                          textDecoration: "underline",
                                      }
                                    : {}
                            }
                        >
                            Sign in here
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Register;
