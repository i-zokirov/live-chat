import { io } from "socket.io-client";

const options = {
    rememberUpgrade: true,
    transports: ["websocket"],
    secure: true,
    rejectUnauthorized: false,
};
const localhost = "http://localhost:5000";

const socket = io.connect(localhost, options);

export default socket;
