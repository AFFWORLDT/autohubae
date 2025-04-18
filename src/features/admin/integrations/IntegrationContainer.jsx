import { useState } from "react";
import styles from "../../../styles/TabContainer.module.css";
import { INTEGRATION_TAB_LIST } from "../../../utils/constants";

function IntegrationContainer() {
    const [activeIntegration, setActiveIntegration] = useState(
        INTEGRATION_TAB_LIST?.[0]?.value
    );

    return (
        <div className={styles.tabContainer}>
            <ul>
                {INTEGRATION_TAB_LIST.map((item) => (
                    <li
                        className={
                            item.value === activeIntegration
                                ? styles.activeTab
                                : ""
                        }
                        key={item.value}
                    >
                        <button
                            onClick={() => setActiveIntegration(item.value)}
                        >
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>

            <div className={styles.tabDetails}>
                {/* {activeIntegration === "company" && <Company />}
                {activeIntegration === "calls" && <Calls />} */}
            </div>
        </div>
    );
}

export default IntegrationContainer;
