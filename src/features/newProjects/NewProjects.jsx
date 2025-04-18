import styles from "../../styles/Listings.module.css";
import { useEffect } from "react";
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

function NewProjects({ 
    isLoading, 
    data, 
    error,
    isFetchingNextPage 
}) {
    const navigate = useNavigate();
    const { addProject, isPending } = useCreateProject();
    const { currentUser } = useAuth();
    const [searchParams] = useSearchParams();
    const projectStatus = searchParams.get("status");

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    function handleNavigate(id) {
        projectStatus === "POOL"
            ? navigate(`/new-projects/list/${id}?status=POOL`)
            : navigate(`/new-projects/list/${id}`);
    }

    function handleClaim(data) {
        data.projectStatus = "ACTIVE";
        addProject({ newProject: { ...data, agent_Id: currentUser.id } });
    }

    return (
        <div style={{ position: 'relative', height: '100%' }}>
            {isLoading ? (
                <div >
                    <Spinner type="fullPage" />
                </div>
            ) : (
                <>
                    <div className={styles.listings}>
                        {data.map((item) => (
                            <div className={styles.listingItem} key={item.id}>
                                <div
                                    className="imgContainer"
                                    onClick={() => handleNavigate(item.id)}
                                >
                                    <img src={item?.photos?.[0]} alt={item?.name} />
                                </div>

                                <div className={styles.listingContent}>
                                    <div className={styles.listingTop}>
                                        <h2>{item?.name}</h2>
                                        <div>
                                            {projectStatus === "POOL" && (
                                                <button
                                                    className="btnNormalSmall"
                                                    onClick={() =>
                                                        handleClaim(item)
                                                    }
                                                    disabled={isPending}
                                                >
                                                    Claim
                                                </button>
                                            )}
                                            <span>
                                                {`${getDaysFromCurrentDate(item?.createTime)} days ago`}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={styles.listingType}>
                                        {item?.propertyTypes?.join(" ")}
                                    </span>
                                    <p
                                        className={styles.price}
                                        onClick={() => handleNavigate(item.id)}
                                    >
                                        <span>
                                            {formatNum(item?.newParam?.price)}
                                        </span>
                                        <span>AED Starting</span>
                                    </p>
                                    <ul onClick={() => handleNavigate(item.id)}>
                                        <li>
                                            <span>Area</span>
                                            <span>{item?.area?.name || "N/A"}</span>
                                        </li>
                                        <li>
                                            <span>Developer</span>
                                            <span>
                                                {item?.developer?.name || "N/A"}
                                            </span>
                                        </li>
                                        <li>
                                            <span>Handover</span>
                                            <span>
                                                {dateToYMD(
                                                    item.newParam?.handoverTime
                                                ) || "N/A"}
                                            </span>
                                        </li>
                                        <li>
                                            <span>Bedrooms</span>
                                            <span>
                                                {`${bedroomString(item.newParam?.bedroomMin)} - ${bedroomString(item.newParam?.bedroomMax)}`}
                                            </span>
                                        </li>
                                        <li>
                                            <span>Size</span>
                                            <span>
                                                {`${item.newParam?.size_min || "N/A"} - ${item.newParam.size_max || "N/A"} sq.ft`}
                                            </span>
                                        </li>
                                        <li>
                                            <span>Agent</span>
                                            <span>
                                                {item?.agent?.name || "N/A"}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ))}
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

export default NewProjects;
