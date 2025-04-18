import styles from "./../../styles/NewPropertyInTable.module.css";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import {
    bedroomString,
    dateToYMD,
    formatNum,
    getDaysFromCurrentDate,
} from "../../utils/utils";
import useCreateProject from "./useCreateProject";
import { useAuth } from "../../context/AuthContext";

function NewProjectsInTable({
    isLoading,
    data,
    error,
    isFetchingNextPage
}) {
    const navigate = useNavigate();
    const { addProject } = useCreateProject();
    const { currentUser } = useAuth();
    const [searchParams] = useSearchParams();
    const projectStatus = searchParams.get("status");
    const [isClaimLoading, setIsClaimLoading] = useState(false);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    async function handleClaim(data) {
        try {
            setIsClaimLoading(true);
            data.projectStatus = "ACTIVE";
            await addProject({ newProject: { ...data, agent_Id: currentUser.id } });
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsClaimLoading(false);
        }
    }

    function handleNavigate(id) {
        projectStatus === "POOL"
            ? navigate(`/new-projects/list/${id}?status=POOL`)
            : navigate(`/new-projects/list/${id}`);
    }

    return (
        <div style={{ position: 'relative', height: '100%' }}>
            {isLoading ? (
                <div >
                    <Spinner type="fullPage" />
                </div>
            ) : (
                <>
                    <div className={styles.tableContainer}>
                        <table className={styles.listingsTable}>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Price</th>
                                    <th>Area</th>
                                    <th>Developer</th>
                                    <th>Handover</th>
                                    <th>Bedrooms</th>
                                    <th>Size</th>
                                    <th>Agent</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item.id} className={styles.listingItem}>
                                        <td>
                                            <div
                                                className={styles.imgContainer}
                                                onClick={() => handleNavigate(item.id)}
                                            >
                                                <img src={item?.photos?.[0]} alt={item.name} />
                                            </div>
                                        </td>
                                        <td>
                                            <h3 onClick={() => handleNavigate(item.id)}>
                                                {item.name}
                                            </h3>
                                            <span>{`${getDaysFromCurrentDate(item.createTime)} days ago`}</span>
                                        </td>
                                        <td>
                                            <span className={styles.listingType}>
                                                {item.propertyTypes.join(" ")}
                                            </span>
                                        </td>
                                        <td>
                                            <p
                                                className={styles.price}
                                                onClick={() => handleNavigate(item.id)}
                                            >
                                                <span>
                                                    {formatNum(item.newParam?.price)}
                                                </span>
                                                <span>AED Starting</span>
                                            </p>
                                        </td>
                                        <td>
                                            <span>{item?.area?.name || "N/A"}</span>
                                        </td>
                                        <td>
                                            <span>
                                                {item?.developer?.name || "N/A"}
                                            </span>
                                        </td>
                                        <td>
                                            <span>
                                                {dateToYMD(
                                                    item.newParam?.handoverTime
                                                ) || "N/A"}
                                            </span>
                                        </td>
                                        <td>
                                            <span>
                                                {`${bedroomString(item.newParam?.bedroomMin)} - ${bedroomString(item.newParam?.bedroomMax)}`}
                                            </span>
                                        </td>
                                        <td>
                                            <span>
                                                {`${item.newParam?.size_min || "N/A"} - ${item.newParam.size_max || "N/A"} sq.ft`}
                                            </span>
                                        </td>
                                        <td>
                                            <span>
                                                {item?.agent?.name || "N/A"}
                                            </span>
                                        </td>
                                        <td>
                                            {projectStatus === "POOL" && (
                                                <button
                                                    className={`${styles.actionBtn} btnNormal`}
                                                    onClick={() => handleClaim(item)}
                                                    disabled={isClaimLoading}
                                                >
                                                    {isClaimLoading ? (
                                                        <Spinner type="inline" />
                                                    ) : (
                                                        "Claim"
                                                    )}
                                                </button>
                                            )}
                                            <button
                                                className={`${styles.actionBtn} btnNormal`}
                                                onClick={() => handleNavigate(item.id)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {isFetchingNextPage && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '1rem',
                            backgroundColor: 'transparent'
                        }}>
                            <Spinner />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default NewProjectsInTable;