import styles from "../../styles/NewListType.module.css";
import { useEffect, useState } from "react";
import Spinner from "../../ui/Spinner";
import toast from "react-hot-toast";
import {
    bedroomString,
    formatNum,
    getDaysFromCurrentDate,
} from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import NewPropertyItemTag from "./NewPropertyItemTag";
import { useSelectedProperties } from "../../context/SelectedPropertiesContext";
import useAllDetails from "../all-details/useAllDetails";
const contextMenuStyles = {
    position: "fixed",
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "8px 0",
    zIndex: 1000,
    minWidth: "200px",
};


const menuItemStyles = {
    padding: "8px 16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#333",
    ":hover": {
        backgroundColor: "#f5f5f5",
    },
};
function NewPropertyInTable({
    listingType,
    isLoading,
    data,
    error,
    totalSize,
    showCheckboxes,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,

}) {
    const navigate = useNavigate();
    const { selectedIds, toggleSelection } = useSelectedProperties();
    const [loadingStates, setLoadingStates] = useState({});
    const { data: allData } = useAllDetails();
    const [contextMenu, setContextMenu] = useState(null);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const getPropertyUrl = (id) => {
        return `/for-${listingType.toLowerCase()}/new-list/${id}`;
    };

    const handleNavigate = (id) => {
        navigate(getPropertyUrl(id));
    };

    const handleContextMenu = (e, id) => {
        e.preventDefault();
        setContextMenu({
            x: e.pageX,
            y: e.pageY,
            id: id,
        });
    };

    const handleOpenInNewTab = (id) => {
        window.open(getPropertyUrl(id), "_blank");
        setContextMenu(null);
    };

    return (
        <div style={{ position: "relative", height: "100%" }}>
            {isLoading ? (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1000,
                    }}
                >
                    <Spinner type="fullPage" />
                </div>
            ) : (
                <>
                    <div className={styles.tableContainer}>
                        <table className={styles.propertyTable}>
                            <thead>
                                <tr>
                                    {showCheckboxes && (
                                        <th
                                            className={styles.checkboxHeader}
                                        ></th>
                                    )}
                                    <th className={styles.imageHeader}>
                                        Property
                                    </th>
                                    <th>Details</th>
                                    <th>Price</th>
                                    <th>Location</th>
                                    <th>Features</th>
                                    <th>Contact</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className={styles.tableRow}
                                        onContextMenu={(e) =>
                                            handleContextMenu(e, item.id)
                                        }
                                        style={{ cursor: "pointer" }}
                                    >
                                        {showCheckboxes && (
                                            <td className={styles.checkboxCell}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(
                                                        item?.id
                                                    )}
                                                    onChange={() =>
                                                        toggleSelection(
                                                            item?.id
                                                        )
                                                    }
                                                />
                                            </td>
                                        )}
                                        <td className={styles.imageCell}>
                                            <div
                                                className={
                                                    styles.propertyImageWrapper
                                                }
                                                style={{ position: "relative" }}
                                            >
                                                {(item.completionStatus ===
                                                    "completed_primary" ||
                                                    item.completionStatus ===
                                                        "completed") && (
                                                    <span
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            top: "1px",
                                                            left: "1px",
                                                            padding: "2px 5px",
                                                            backgroundColor:
                                                                "#4CAF50", // Green for Completed
                                                            color: "white",
                                                            fontWeight: "bold",
                                                            borderRadius:
                                                                "12px",
                                                            fontSize: "5px",
                                                            boxShadow:
                                                                "0 4px 8px rgba(0, 0, 0, 0.2)",
                                                            textTransform:
                                                                "uppercase",
                                                            zIndex: 1,
                                                        }}
                                                    >
                                                        Completed
                                                    </span>
                                                )}
                                                {(item.completionStatus ===
                                                    "off_plan" ||
                                                    item.completionStatus ===
                                                        "off_plan_primary") && (
                                                    <span
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            top: "1px",
                                                            left: "1px",
                                                            padding: "2px 5px",
                                                            backgroundColor:
                                                                "#FF5722", // Red for Off Primary
                                                            color: "white",
                                                            fontWeight: "bold",
                                                            borderRadius:
                                                                "12px",
                                                            fontSize: "5px",
                                                            boxShadow:
                                                                "0 4px 8px rgba(0, 0, 0, 0.2)",
                                                            textTransform:
                                                                "uppercase",
                                                            zIndex: 1,
                                                        }}
                                                    >
                                                        Off Plan
                                                    </span>
                                                )}

                                                <img
                                                    src={item.photos?.[0]}
                                                    alt={item.title}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        borderRadius: "10px",
                                                        boxShadow:"0 4px 8px rgba(0, 0, 0, 0.2)",
                                                        }}
                                                       
                                                        
                                                />
                                                {item.propertyFinder && (
                                                    <img
                                                        src="/icons/property-finder.png"
                                                        className={`${styles.propertyFinderIcon} ${
                                                            item?.propertyFinder ===
                                                            "REQ_ENABLE"
                                                                ? "image-adjuster-2"
                                                                : ""
                                                        }`}
                                                        alt="Property Finder"
                                                    />
                                                )}
                                                {item?.bayut && (
                                                    <>
                                                        <img
                                                            src="/icons/bayut.png"
                                                            className={`${styles.bayutPortal} ${item?.bayut === "REQ_ENABLE" ? "image-adjuster-2" : ""}`}
                                                        />
                                                    </>
                                                )}
                                                {item?.dubizzle && (
                                                    <>
                                                        <img
                                                            src="/icons/dubizzle.png"
                                                            className={`${styles.dubizzlePortal} ${item?.dubizzle === "REQ_ENABLE" ? "image-adjuster-2" : ""}`}
                                                        />
                                                    </>
                                                )}
                                                {item.propfusionPortal && (
                                                    <img
                                                        src="/icons/PROPFUSION_LOGO.png"
                                                        className={`${styles.propfusionPortal} ${
                                                            item?.propfusionPortal ===
                                                            "REQ_ENABLE"
                                                                ? "image-adjuster-2"
                                                                : ""
                                                        }`}
                                                        alt="Property Finder"
                                                    />
                                                )}
                                                {item?.customPortal && (
                                                    <>
                                                        <img
                                                            src="/icons/customePortal.png"
                                                            className={`${styles.customPortal} ${item?.customPortal === "REQ_ENABLE" ? "image-adjuster-2" : ""}`}
                                                        />
                                                    </>
                                                )}
                                                {item?.ownPortal && (
                                                    <>
                                                        <img
                                                            src={
                                                                allData
                                                                    ?.company_settings
                                                                    ?.company_logo_url
                                                            }
                                                            className={`${styles.ownPortal} ${item?.ownPortal === "REQ_ENABLE" ? "image-adjuster-2" : ""}`}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className={styles.detailsCell}>
                                            <div
                                                className={
                                                    styles.propertyDetails
                                                }
                                            >
                                                <h3>{item.title}</h3>
                                                <div className={styles.tags}>
                                                    <NewPropertyItemTag
                                                        propertyData={item}
                                                    />
                                                    <span
                                                        className={
                                                            styles.propertyType
                                                        }
                                                    >
                                                        {item.property_type}
                                                    </span>
                                                </div>
                                                <span
                                                    className={
                                                        styles.listedTime
                                                    }
                                                >
                                                    Listed{" "}
                                                    {getDaysFromCurrentDate(
                                                        item.createTime
                                                    )}{" "}
                                                    days ago
                                                </span>
                                            </div>
                                        </td>
                                        <td className={styles.priceCell}>
                                            <div
                                                className={styles.priceWrapper}
                                            >
                                                <span
                                                    className={
                                                        styles.priceAmount
                                                    }
                                                >
                                                    {formatNum(item.price)}
                                                </span>
                                                <span
                                                    className={styles.priceUnit}
                                                >
                                                    AED
                                                    {listingType === "RENT"
                                                        ? `/${item?.priceType || "Year"}`
                                                        : ""}
                                                </span>
                                            </div>
                                        </td>
                                        <td className={styles.locationCell}>
                                            <div
                                                className={styles.locationInfo}
                                            >
                                                <p className={styles.community}>
                                                    {item.community || "N/A"}
                                                </p>
                                                <p className={styles.area}>
                                                    {item.area?.name || "N/A"}
                                                </p>
                                                <p className={styles.developer}>
                                                    By{" "}
                                                    {item.developer?.name ||
                                                        "N/A"}
                                                </p>
                                            </div>
                                        </td>
                                        <td className={styles.featuresCell}>
                                            <div
                                                className={styles.featuresList}
                                            >
                                                <div className={styles.feature}>
                                                    <span
                                                        className={
                                                            styles.featureLabel
                                                        }
                                                    >
                                                        Size:
                                                    </span>
                                                    <span>
                                                        {item.size || "N/A"}{" "}
                                                        sq.ft
                                                    </span>
                                                </div>
                                                <div className={styles.feature}>
                                                    <span
                                                        className={
                                                            styles.featureLabel
                                                        }
                                                    >
                                                        Beds:
                                                    </span>
                                                    <span>
                                                        {bedroomString(
                                                            item.bedRooms
                                                        )}
                                                    </span>
                                                </div>
                                                <div className={styles.feature}>
                                                    <span
                                                        className={
                                                            styles.featureLabel
                                                        }
                                                    >
                                                        Baths:
                                                    </span>
                                                    <span>
                                                        {item?.washRoom ||
                                                            item?.bathrooms ||
                                                            "N/A"}
                                                    </span>
                                                </div>
                                                <div className={styles.feature}>
                                                    <span
                                                        className={
                                                            styles.featureLabel
                                                        }
                                                    >
                                                        Floor:
                                                    </span>
                                                    <span>
                                                        {item?.floor || "N/A"}/
                                                        {item?.totalFloor ||
                                                            "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.agentCell}>
                                            <div className={styles.agentInfo}>
                                                <span
                                                    className={styles.agentName}
                                                >
                                                    {item?.agent?.name || "N/A"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className={styles.actionsCell}>
                                            <button
                                                className={`${styles.viewButton} ${loadingStates[item.id] ? styles.loading : ""}`}
                                                onClick={() =>
                                                    handleNavigate(item.id)
                                                }
                                                disabled={
                                                    loadingStates[item.id]
                                                }
                                            >
                                                {!loadingStates[item.id] && (
                                                    <>
                                                        View
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            className={
                                                                styles.buttonIcon
                                                            }
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {isFetchingNextPage && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                padding: "1rem",
                                backgroundColor: "transparent",
                            }}
                        >
                            <Spinner />
                        </div>
                    )}
                </>
            )}
            {contextMenu && (
                <div
                    style={{
                        ...contextMenuStyles,
                        left: contextMenu.x,
                        top: contextMenu.y,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        style={menuItemStyles}
                        onClick={() => handleOpenInNewTab(contextMenu.id)}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Open in new tab
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewPropertyInTable;
