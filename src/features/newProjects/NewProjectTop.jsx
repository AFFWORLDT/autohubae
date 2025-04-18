import { dateToYMD, formatNum } from "../../utils/utils";
import PropertyImageGallery from "../properties/PropertyImageGallery";
import styles from "../../styles/ListingItemTop.module.css";
import AgentContact from "../../ui/AgentContact";
import NewProjectMenus from "./NewProjectMenus";
import useUpdateProject from "./useUpdateProject";
import useCreateProject from "./useCreateProject";
import { useAuth } from "../../context/AuthContext";

function NewProjectTop({ data, projectStatus }) {
    const { changeProject, isPending: isPendingUpdate } = useUpdateProject();
    const { addProject, isPending: isPendingAdd } = useCreateProject();
    const { currentUser } = useAuth();

    function handleChangeAgent(agentId, onCloseModal) {
        changeProject(
            {
                projectId: data.id,
                updatedProject: { ...data, agent_Id: agentId },
            },
            {
                onSettled: onCloseModal,
            }
        );
    }

    function handleClaim(data) {
        data.projectStatus = "ACTIVE";
        addProject({ newProject: { ...data, agent_Id: currentUser.id } });
    }

    return (
        <div className={`sectionDiv ${styles.listingItemTop}`}>
            <PropertyImageGallery
                images={
                    data.photos?.map((url) => {
                        return {
                            original: url,
                            thumbnail: url,
                        };
                    }) || []
                }
            />

            <div className={styles.listingItemTopContent}>
                {projectStatus !== "POOL" && <NewProjectMenus data={data} />}

                <span className={styles.status}>
                    {projectStatus === "POOL" ? "POOL" : data.projectStatus}
                </span>

                <h1>{data.name}</h1>

                <p className={styles.location}>
                    <img src="/icons/location.svg" alt="" />
                    <span>{data?.area?.name || "N/A"}</span>
                </p>

                <p className={styles.price}>
                    <span>{formatNum(data.newParam?.price)} AED Starting</span>
                </p>

                <div className={styles.type}>
                    {data.propertyTypes.map((item, i) => (
                        <span key={i}>{item}</span>
                    ))}
                </div>

                <p className={styles.developer}>
                    <span>Developer: </span>
                    <span>{data?.developer?.name || "N/A"}</span>
                </p>

                <p className={styles.handoverTime}>
                    <span>Handover Date: </span>
                    <span>
                        {dateToYMD(data.newParam.handoverTime || "N/A")}
                    </span>
                </p>

                {projectStatus === "POOL" ? (
                    <button
                        style={{ width: "100%" }}
                        className="btnNormalLarge"
                        onClick={() => handleClaim(data)}
                        disabled={isPendingAdd}
                    >
                        Claim Project
                    </button>
                ) : (
                    <AgentContact
                        onChangeAgent={handleChangeAgent}
                        isChangingAgent={isPendingUpdate}
                        agentAvatar={data?.agent?.avatar}
                        agentName={data?.agent?.name}
                        agentPhone={data?.agent?.phone}
                        agentMail={data?.agent?.email}
                    />
                )}
            </div>
        </div>
    );
}

export default NewProjectTop;
