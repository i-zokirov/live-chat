import { io } from "socket.io-client";

const options = {
    rememberUpgrade: true,
    transports: ["websocket"],
    secure: true,
    rejectUnauthorized: false,
};
export const localhost = "http://localhost:5000";

const socket = io.connect("/", options);

export default socket;
