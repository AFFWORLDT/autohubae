import { useSearchParams } from "react-router-dom";
import useProject from "../../features/newProjects/useProject";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import PageNotFound from "../PageNotFound";
import BtnCreatePdf from "../../ui/BtnCreatePdf";
import styles from "../../styles/ShareListing.module.css";
import { bedroomString, dateToYMD, formatNum } from "../../utils/utils";
import useStaff from "../../features/admin/staff/useStaff";
import useCompanySettings from "../../features/admin/general/useCompanySettings";
import { AMENITIES_OPTIONS } from "../../utils/constants";

const ID = "shareProjectDetails";

function ShareProject() {
    const [searchParams] = useSearchParams();
    const isPdf = searchParams.get("pdf") ? true : false;
    const userId = searchParams.get("userId");
    const { data } = useCompanySettings();

    const {
        data: userData,
        isLoading: isLoadingUser,
        error: errorUser,
    } = useStaff(userId);
    const {
        data: projectData,
        isLoading: isLoadingProject,
        error: errorProject,
    } = useProject();
  

    useEffect(() => {
        if (errorUser) toast.error(errorUser.message);
    }, [errorUser]);

    useEffect(() => {
        if (errorProject) toast.error(errorProject.message);
    }, [errorProject]);

   

    if (isLoadingProject  || isLoadingUser)
        return <Spinner type="fullPage" />;
    if (projectData.length === 0) return <PageNotFound />;

    const amenitiesDisplay = AMENITIES_OPTIONS
        .filter((obj) => projectData[0].newParam.amenities?.includes(obj.code))
        .map((obj) => {
            return {
                label: obj.label,
                value: obj.code,
            };
        });

    return (
        <section id={ID} className={styles.shareListing}>
            {isPdf && <BtnCreatePdf id={ID} />}

            <div className={styles.shareListingBg}></div>

            <div className={styles.shareListingContent}>
                <div className={styles.listingHeader}>
                    <div className={styles.logo}>
                        <img src={data?.company_logo_url} />
                        <h2>{data?.company_name}</h2>
                    </div>
                    <div className={styles.userDetails}>
                        <img src={userData.avatar} />
                        <div className={styles.userDetailsContent}>
                            <h2>{userData.name}</h2>
                            <div>
                                <img src="/share-page/call.png" />
                                <span>{userData.phone}</span>
                            </div>
                            <div>
                                <img src="/share-page/mail.png" />
                                <span>{userData.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.listingHero}>
                    <div className={styles.imagesGrid}>
                        <div className="imgContainer">
                            <img src={projectData[0].photos?.[0]} />
                        </div>
                        <div className="imgContainer">
                            <img src={projectData[0].photos?.[1]} />
                        </div>
                        <div className="imgContainer">
                            <img src={projectData[0].photos?.[2]} />
                        </div>
                        <div className="imgContainer">
                            <img src={projectData[0].photos?.[3]} />
                        </div>
                        <div className="imgContainer">
                            <img src={projectData[0].photos?.[4]} />
                        </div>
                    </div>

                    <div className={styles.listingHeroContent}>
                        <h1>{projectData[0].name}</h1>
                        <span>{projectData[0].propertyTypes.join(" | ")}</span>
                        <p className={styles.price}>
                            <span>
                                {formatNum(projectData[0].newParam.price)}
                            </span>
                            <span>AED Starting</span>
                        </p>
                        <ul>
                            <li>
                                <div>
                                    <img src="/share-page/developer.png" />
                                    <span>Developer</span>
                                </div>
                                <span>{projectData[0].developer?.name}</span>
                            </li>
                            <li>
                                <div>
                                    <img src="/share-page/area.png" />
                                    <span>Area</span>
                                </div>
                                <span>{projectData[0].area?.name}</span>
                            </li>
                            <li>
                                <div>
                                    <img src="/share-page/calendar.png" />
                                    <span>Handover Date</span>
                                </div>
                                <span>
                                    {dateToYMD(
                                        projectData[0].newParam.handoverTime
                                    )}
                                </span>
                            </li>
                            <li>
                                <div>
                                    <img src="/share-page/size.png" />
                                    <span>Size</span>
                                </div>
                                <span>
                                    {`${projectData[0].newParam.size_min || "N/A"} - ${projectData[0].newParam.size_max || "N/A"} sq.ft`}
                                </span>
                            </li>
                            <li>
                                <div>
                                    <img src="/share-page/bedroom.png" />
                                    <span>Bedrooms</span>
                                </div>
                                <span>
                                    {`${bedroomString(projectData[0].newParam.bedroomMin)} - ${bedroomString(projectData[0].newParam.bedroomMax)}`}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.listingInfo}>
                    <ul>
                        <li>
                            <span>Service Charge: </span>
                            <span>
                                {projectData[0].newParam.propertyFee || "N/A"}
                            </span>
                        </li>
                        <li>
                            <span>Total Floor: </span>
                            <span>
                                {projectData[0].newParam.totalFloor || "N/A"}
                            </span>
                        </li>
                        <li>
                            <span>Total Units: </span>
                            <span>
                                {projectData[0].newParam.totalUnits || "N/A"}
                            </span>
                        </li>
                        <li>
                            <span>Listed On: </span>
                            <span>
                                {dateToYMD(projectData[0].createTime) || "N/A"}
                            </span>
                        </li>
                    </ul>
                </div>

                <div className={styles.listingDescription}>
                    <h3>
                        <div></div>
                        <span>Description</span>
                    </h3>
                    <p>{projectData[0].description || ""}</p>
                </div>

                <div className={styles.listingPaymentPlan}>
                    <h3>
                        <div></div>
                        <span>Payment Plan</span>
                    </h3>
                    <ul>
                        {Object.keys(projectData[0].payment_planParam).map(
                            (objKey, i) => (
                                <li key={i}>
                                    <img
                                        src={`/share-page/${objKey.replace("_", "-")}.png`}
                                    />
                                    <span>
                                        {
                                            projectData[0].payment_planParam[
                                                objKey
                                            ]
                                        }
                                        %
                                    </span>
                                    <span>{objKey.replace("_", " ")}</span>
                                </li>
                            )
                        )}
                    </ul>
                </div>

                <div className={styles.listingAmenities}>
                    <h3>
                        <div></div>
                        <span>Amenities</span>
                    </h3>
                    <div className={styles.amenitiesContainer}>
                        {amenitiesDisplay.map((item) => (
                            <div className={styles.amenity} key={item.value}>
                                <div>{item.value}</div>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.listingFloorPlan}>
                    <h3>
                        <div></div>
                        <span>Floor Plan</span>
                    </h3>
                    <div className={styles.floorPlanContainer}>
                        {projectData[0].floor_plans?.map((plan) => (
                            <div className={styles.floorPlanItem} key={plan.id}>
                                <div className="imgContainer">
                                    <img src={plan.layout} />
                                </div>
                                <div className={styles.floorPlanContent}>
                                    <span>{plan.title}</span>
                                    <span>{plan.size} sq.ft</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ShareProject;
