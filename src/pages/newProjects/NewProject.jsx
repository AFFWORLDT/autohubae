import { useEffect, useState } from "react";
import styles from "../../styles/ListingItem.module.css";
import useProject from "../../features/newProjects/useProject";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import PageNotFound from "../PageNotFound";
import SectionTop from "../../ui/SectionTop";
import NewProjectTop from "../../features/newProjects/NewProjectTop";
import { bedroomString, dateToYMD, formatNum } from "../../utils/utils";
import FollowUps from "../../features/followUps/FollowUps";
import { useSearchParams } from "react-router-dom";

function NewProject() {
    const { data, isLoading, error } = useProject();
    const [searchParams] = useSearchParams();
    const projectStatus = searchParams.get("status");

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    if (isLoading) return <Spinner type="fullPage" />;
    if (data.length === 0) return <PageNotFound />;

    return (
        <div className="sectionContainer">
            <SectionTop heading="New Project Detail" />

            <section className="sectionStyles">
                <div className={styles.listingItem}>
                    <NewProjectTop
                        data={data[0]}
                        projectStatus={projectStatus}
                    />

                    <div className={styles.listingFlexRow}>
                        <div className={`sectionDiv ${styles.details}`}>
                            <h3>
                                <img src="/icons/grid.svg" alt="" />
                                <span>Details</span>
                            </h3>
                            <ul>
                                <li>
                                    <span>ID: </span>
                                    <span>{data[0].id}</span>
                                </li>
                                <li>
                                    <span>Bedrooms: </span>
                                    <span>
                                        {`${bedroomString(data[0].newParam.bedroomMin)} - ${bedroomString(data[0].newParam.bedroomMax)}`}
                                    </span>
                                </li>
                                <li>
                                    <span>Size: </span>
                                    <span>
                                        {`${data[0].newParam.size_min || "N/A"} - ${data[0].newParam.size_max || "N/A"} sq.ft`}
                                    </span>
                                </li>
                                <li>
                                    <span>Service Charge: </span>
                                    <span>
                                        {data[0].newParam.propertyFee || "N/A"}
                                    </span>
                                </li>
                                <li>
                                    <span>Total Floor: </span>
                                    <span>
                                        {data[0].newParam.totalFloor || "N/A"}
                                    </span>
                                </li>
                                <li>
                                    <span>Total Units: </span>
                                    <span>
                                        {data[0].newParam.totalUnits || "N/A"}
                                    </span>
                                </li>
                                <li>
                                    <span>Listed On: </span>
                                    <span>
                                        {dateToYMD(data[0].createTime) || "N/A"}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {projectStatus !== "POOL" && (
                            <FollowUps type="project" targetId={data[0].id} />
                        )}
                    </div>

                    <div className={`sectionDiv ${styles.description}`}>
                        <h3>
                            <img src="/icons/document.svg" alt="" />
                            <span>Description</span>
                        </h3>
                        <p>{data[0].description}</p>
                    </div>

                    <FloorPlans floorPlansData={data[0].floor_plans} />

                    <div className={`sectionDiv ${styles.paymentPlan}`}>
                        <h3>
                            <img src="/icons/wallet.svg" alt="" />
                            <span>Payment Plan</span>
                        </h3>
                        <ul>
                            <li>
                                <span>First Installment: </span>
                                <span>
                                    {
                                        data[0].payment_planParam
                                            .first_installment
                                    }
                                    %
                                </span>
                            </li>
                            <li>
                                <span>Under Construction: </span>
                                <span>
                                    {
                                        data[0].payment_planParam
                                            .under_construction
                                    }
                                    %
                                </span>
                            </li>
                            <li>
                                <span>On Handover: </span>
                                <span>
                                    {data[0].payment_planParam.on_handover}%
                                </span>
                            </li>
                            <li>
                                <span>Post Handover: </span>
                                <span>
                                    {data[0].payment_planParam.post_handover}%
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}

function FloorPlans({ floorPlansData }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLoadingImg, setIsLoadingImg] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    function handleFloorPlanToggle(index) {
        if (selectedIndex === index) return;
        setSelectedIndex(index);
        setIsLoadingImg(true);
    }

    function handleImageClick() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    if (!floorPlansData || floorPlansData.length === 0) return null;
    const selectedStyleObj = floorPlansData[selectedIndex];

    return (
        <div className={`sectionDiv ${styles.floorPlan}`}>
            <h3>
                <img src="/icons/book.svg" alt="" />
                <span>Floor Plan</span>
            </h3>

            <div className={styles.floorSelect}>
                {floorPlansData.map((item, index) => (
                    <button
                        className={selectedIndex === index ? styles.active : ""}
                        onClick={() => handleFloorPlanToggle(index)}
                        key={item.id}
                    >
                        {item.title}
                    </button>
                ))}
            </div>

            <div className={styles.floorContainer}>
                <div
                    className={`imgContainer ${isLoadingImg ? styles.imgLazyLoad : ""}`}
                >
                    <img
                        style={{
                            visibility: isLoadingImg ? "hidden" : "visible",
                        }}
                        onLoad={() => setIsLoadingImg(false)}
                        src={selectedStyleObj.layout}
                        alt=""
                        onClick={handleImageClick} 
                    />
                </div>

                <div className={styles.floorContent}>
                    <span>{selectedStyleObj.title}</span>
                    <span>
                        Price: {formatNum(selectedStyleObj.price) || "N/A"}
                    </span>
                    <span>Size: {selectedStyleObj.size} sq.ft</span>
                </div>
            </div>

            {isModalOpen && (
                <div className={styles.modal} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <img src={selectedStyleObj.layout} alt="" className={styles.fullImage} />
                        <button onClick={closeModal} className={styles.closeButton}>
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewProject;
