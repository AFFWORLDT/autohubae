import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./SubscriptionCheck.module.css";
import Spinner from "../ui/Spinner";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import useAllDetails from "../features/all-details/useAllDetails";

function SubscriptionCheck() {
    const { data: allData, isLoading: allDataLoading, error: allDataError } = useAllDetails()
    const subData = allData?.subscription_status;

    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        if (allDataError) toast.error(allDataError.message);
    }, [allDataError]);

    if (allDataLoading) return <Spinner type="fullPage" />;

    if (
        allDataError ||
        (!subData?.is_active && pathname !== "/admin/general/subscription")
    ) {
        return (
            <>
                <Outlet />
                {createPortal(
                    <div className={styles.modalSubscription}>
                        <div className={styles.modalSubscriptionContainer}>
                            <img src="/images/oops.png" />
                            <p>
                                Your subscription has expired! Contact admin 😢
                            </p>
                            <button
                                onClick={() =>
                                    navigate("/admin/general/subscription")
                                }
                                className="btnSubmit"
                            >
                                Check Subscription
                            </button>
                        </div>
                    </div>,
                    document.body
                )}
            </>
        );
    } else {
        return <Outlet />;
    }
}

export default SubscriptionCheck;
