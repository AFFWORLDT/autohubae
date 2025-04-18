import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageNotFound from "./PageNotFound";

function ProtectedRoute({ roles }) {
    const { currentUser } = useAuth();

    if (currentUser && !roles.includes(currentUser.role))
        return <PageNotFound />;

    return <Outlet />;
}

export default ProtectedRoute;
