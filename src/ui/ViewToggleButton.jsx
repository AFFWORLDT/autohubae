import { useSearchParams } from "react-router-dom";
import styles from "./ViewToggleButton.module.css";

function ViewToggleButton({
    defaultView = "table",
    viewParamName = "viewType",
    viewOptions = [],
    onViewChange
}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentView = searchParams.get(viewParamName) ?? defaultView;
    const isMultiOption = viewOptions && viewOptions.length > 0;

    function handleViewChange(newViewType) {
        if (currentView === newViewType) return;

        if (onViewChange) {
            onViewChange(newViewType);
        } else {
            searchParams.set(viewParamName, newViewType);
            setSearchParams(searchParams);
        }
    }

    if (isMultiOption) {
        return (
            <div className={styles.viewToggleContainerMulti}>
                {viewOptions.map((option) => (
                    <button
                        key={option.value}
                        className={`${styles.btnViewMulti} ${currentView === option.value ? styles.activeMulti : ""}`}
                        type="button"
                        onClick={() => handleViewChange(option.value)}
                        title={option.label || `Switch to ${option.value} view`}
                    >
                        {option.icon && <span className={styles.iconMulti}>{option.icon}</span>}
                    </button>
                ))}
            </div>
        );
    }

    const legacyToggle = () => {
        const newViewType = currentView === "table" ? "card" : "table";
        handleViewChange(newViewType);
    };

    return (
        <div className={styles.viewToggleContainerLegacy}>
            <button
                className={`${styles.btnViewLegacy} ${currentView === "table" ? styles.activeLegacyTable : styles.activeLegacyCard}`}
                type="button"
                onClick={legacyToggle}
            >
                <img
                    src={`/icons/${currentView === "table" ? "grid" : "list"}.svg`}
                    alt={`Switch to ${currentView === "table" ? "card" : "table"} view`}
                />
                <span>
                    {currentView === "table" ? "Card" : "Table"} View
                </span>
            </button>
        </div>
    );
}

export default ViewToggleButton;