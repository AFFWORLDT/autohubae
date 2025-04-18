import { useEffect, useState } from "react";
import styles from "./SubscriptionContainer.module.css";
import Spinner from "../../../ui/Spinner";
import toast from "react-hot-toast";
import { dateToYMD } from "../../../utils/utils";
import useAllDetails from "../../all-details/useAllDetails";

const PRICES = {
    annual: ["999", "1299", "1599"],
    monthly: ["1299", "1599", "1999"],
};

function SubscriptionContainer() {
    const [activeTab, setActiveTab] = useState("annual"); // "annual" | "monthly"
    const { data: allData, isLoading: allDataLoading, error: allDataError } = useAllDetails()
    const subData = allData?.subscription_status;
    useEffect(() => {
        if (allDataError) return toast.error(allDataError.message);
    }, [allDataError]);

    if (allDataLoading) return <Spinner type="fullPage" />;

    return (
        <div className={styles.subscriptionContainer}>
            <div className={styles.subscriptionTabs}>
                <button
                    onClick={() => setActiveTab("annual")}
                    className={
                        activeTab === "annual" ? styles.btnActiveTab : ""
                    }
                >
                    Annual
                </button>
                <button
                    onClick={() => setActiveTab("monthly")}
                    className={
                        activeTab === "monthly" ? styles.btnActiveTab : ""
                    }
                >
                    Monthly
                </button>
            </div>

            <p>
                <img src="/icons/sparkles.svg" />
                {subData?.is_active ? (
                    <span>
                        Subscription Ending on{" "}
                        {dateToYMD(subData?.subscription_end_date)}
                    </span>
                ) : (
                    <span>Your subscription has expired!</span>
                )}
            </p>

            <div className={styles.subscriptionCards}>
                <div className={styles.subscriptionCard}>
                    <div className={styles.subscriptionCardInner}>
                        <h3>StartUp Prop</h3>
                        <p className={styles.subscriptionPrice}>
                            <span>AED {PRICES[activeTab][0]}</span>
                            <span>/month</span>
                        </p>
                        <button className={styles.btnBuySubscription}>
                            Subscribe
                        </button>
                    </div>
                </div>

                <div className={styles.subscriptionCard}>
                    <div className={styles.subscriptionCardInner}>
                        <h3>Elite Prop</h3>
                        <p className={styles.subscriptionPrice}>
                            <span>AED {PRICES[activeTab][1]}</span>
                            <span>/month</span>
                        </p>
                        <button className={styles.btnBuySubscription}>
                            Subscribe
                        </button>
                    </div>
                </div>

                <div className={styles.subscriptionCard}>
                    <div className={styles.subscriptionCardInner}>
                        <h3>Titanium Prop</h3>
                        <p className={styles.subscriptionPrice}>
                            <span>AED {PRICES[activeTab][2]}</span>
                            <span>/month</span>
                        </p>
                        <button className={styles.btnBuySubscription}>
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubscriptionContainer;
