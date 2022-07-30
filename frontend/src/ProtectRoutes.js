import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
const ProtectRoute = ({
    children,
    authenticated,
    redirectPath = "/signin",
}) => {
    const location = useLocation();

    if (!authenticated) {
        return (
            <Navigate
                to={redirectPath}
                state={{ prevPath: location.pathname }}
            />
        );
    }
    return children ? children : <Outlet />;
};

export default ProtectRoute;
