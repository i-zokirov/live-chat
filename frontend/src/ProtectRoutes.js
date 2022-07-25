import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const ProtectRoute = ({
    children,
    authenticated,
    redirectPath = "/signin",
}) => {
    if (!authenticated) {
        return <Navigate to={redirectPath} />;
    }
    return children ? children : <Outlet />;
};

export default ProtectRoute;
