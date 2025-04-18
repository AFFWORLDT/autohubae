import { useEffect } from "react";
import Spinner from "../../ui/Spinner";
import toast from "react-hot-toast";
import styles from "./Logs.module.css";

function Logs({ leadLogs, isLoading, isError, title = "Lead Logs" }) {
    useEffect(() => {
        if (isError) toast.error(isError.message);
    }, [isError]);

    if (isLoading) return <Spinner type="fullPage" />;

    return (
        <div className="sectionDiv">
            <div className={styles.leadLogsTop}>
                <h3>
                    <img src="/icons/description.svg" alt="" />
                    <span>{title}</span>
                </h3>
            </div>
            <div className={`${styles.logsContainer}`}>
                {leadLogs?.data?.logs?.length > 0 ? (
                    leadLogs?.data?.logs?.map((log) => (
                        <div key={log.id} className={styles.logItem}>
                            <div className={styles.logHeader}>
                                <img
                                    src={log?.agent_avatar}
                                    alt={log?.agent_name}
                                    className={styles.agentAvatar}
                                />
                                <div>
                                    <strong>{log?.agent_name}</strong>
                                    <br />
                                    <span className={styles.logTimestamp}>
                                        {new Date(log?.timestamp).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <p className={styles.logMessage}>{log.message}</p>
                        </div>
                    ))
                ) : (
                    <p className={styles.noLogs}>
                        No logs available for this lead.
                    </p>
                )}
            </div>
        </div>
    );
}

export default Logs;
