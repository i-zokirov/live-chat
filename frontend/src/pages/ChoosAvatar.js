import React, { useState, useEffect } from "react";
import {
    Container,
    Card,
    Avatar,
    Typography,
    Box,
    CardActionArea,
    Alert,
    AlertTitle,
    Button,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import images from "../utils/images";
import { updateUser } from "../redux/actions/actions";
import { useNavigate } from "react-router-dom";

const ChoosAvatar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, data, error } = useSelector((state) => state.updateUser);
    const { data: userData } = useSelector((state) => state.auth);
    const [avatar, setAvatar] = useState(userData.avatar || null);
    const [alert, setAlert] = useState(null);
    const theme = useTheme();
    const mobileScreen = useMediaQuery("(max-width:600px)");
    const updateUserAvatar = (e) => {
        e.preventDefault();
        if (avatar) {
            dispatch(updateUser({ avatar }));
        }
    };

    const goBack = () => {
        navigate("/chats");
    };

    useEffect(() => {
        if (error) {
            setAlert({ title: "Error", severity: "error", message: error });
            setTimeout(() => {
                setAlert(null);
            }, 3000);
        }
        if (data) {
            setAlert({
                title: "Success",
                severity: "success",
                message: "Your avatar has been updated",
            });
            setTimeout(() => {
                setAlert(null);
                navigate("/chats");
            }, 1000);
        }
    }, [error, data, navigate]);

    return (
        <Container
            sx={{
                height: mobileScreen ? "100vh" : "40vh",
                width: mobileScreen ? "100vw" : "40vw",
            }}
            style={{ boxSizing: "border-box" }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "20px",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Choose your avatar:
                </Typography>
            </Box>
            {alert && (
                <Alert variant="filled" severity={alert.severity}>
                    {" "}
                    <AlertTitle>{alert.title}</AlertTitle>
                    {alert.message}
                </Alert>
            )}
            <Box className="row">
                {images.map((image, index) => (
                    <Box className="column" key={index}>
                        <Card
                            sx={{
                                height: mobileScreen ? "80px" : "150px",
                                width: mobileScreen ? "80px" : "150px",
                                bgcolor:
                                    avatar === image
                                        ? theme.palette.secondary.main
                                        : "",
                            }}
                            className="avatar-card"
                        >
                            <CardActionArea
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    width: "100%",
                                    height: "100%",
                                }}
                                className="avatar-card-action"
                                onClick={() => setAvatar(image)}
                            >
                                <Avatar
                                    src={image}
                                    alt="avatar"
                                    sx={{
                                        width: mobileScreen ? 60 : 100,
                                        height: mobileScreen ? 60 : 100,
                                    }}
                                />
                            </CardActionArea>
                        </Card>
                    </Box>
                ))}
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <LoadingButton
                    color="secondary"
                    type="submit"
                    loadingPosition="start"
                    loading={loading}
                    variant="contained"
                    startIcon={<CheckCircleIcon />}
                    onSubmit={updateUserAvatar}
                    onClick={updateUserAvatar}
                    sx={{ margin: "10px" }}
                >
                    Continue
                </LoadingButton>
                <LoadingButton
                    color="primary"
                    type="submit"
                    loadingPosition="start"
                    variant="contained"
                    startIcon={<ChevronLeftIcon />}
                    onClick={goBack}
                    sx={{ margin: "10px" }}
                >
                    Go Back
                </LoadingButton>
            </Box>
        </Container>
    );
};

export default ChoosAvatar;
