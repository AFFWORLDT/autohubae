import styles from "../../../styles/ListingItem.module.css";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Spinner from "../../../ui/Spinner";
import PageNotFound from "../../PageNotFound";
import SectionTop from "../../../ui/SectionTop";
import { bedroomString, dateToYMD, formatNum } from "../../../utils/utils";
import useNewProperty from "../../../features/properties/useNewProperty";
import NewPropertyTop from "../../../features/properties/NewPropertyTop";
import FollowUps from "../../../features/followUps/FollowUps";
import AgentContact from "../../../ui/AgentContact";
import useStaff from "../../../features/admin/staff/useStaff";
import useUpdateProperty from "../../../features/properties/useUpdateProperty";
import usePropertyLogs from "../../../features/properties/usePropertyLogs";
import Logs from "../../leads/Logs";
import PropertyLeades from "../../leads/GetLeades";
import WhatsappLeads from "../../leads/GetWhatsappLeads";

function NewRentProperty() {
    const { data, isLoading, error } = useNewProperty();
    const { changeProperty, isPending } = useUpdateProperty();
    const { data: propertyFinderAgentData } = useStaff(
        data[0]?.propertyFinder_agent_Id
    );
    const { data: propfusionAgentData } = useStaff(
        data[0]?.propfusionPortal_agent_Id
    );
    const { data: ownPortalAgentData } = useStaff(data[0]?.ownPortal_agent_Id);
    const { data: bayutDubizzleAgentData } = useStaff(
        data[0]?.bayut_dubizzle_agent_Id
    );
    const {
        propertyLogsData,
        isLoading: logsLoading,
        error: logsError,
    } = usePropertyLogs();

    function handleChangeAgent(agentType, agentId, onCloseModal) {
        const updatedFields = {
            propertyFinder_agent_Id:
                agentType === "propertyFinder"
                    ? agentId
                    : data[0].propertyFinder_agent_Id,
            propfusionPortal_agent_Id:
                agentType === "propfusion"
                    ? agentId
                    : data[0].propfusionPortal_agent_Id,
            ownPortal_agent_Id:
                agentType === "ownPortal"
                    ? agentId
                    : data[0].ownPortal_agent_Id,
            bayut_dubizzle_agent_Id:
                agentType === "bayutDubizzle"
                    ? agentId
                    : data[0].bayut_dubizzle_agent_Id,
        };

        changeProperty(
            {
                id: data[0].id,
                updatedProperty: { ...data[0], ...updatedFields },
            },
            {
                onSettled: onCloseModal,
            }
        );
    }

    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    if (isLoading) return <Spinner type="fullPage" />;
    if (data.length === 0) return <PageNotFound />;

    return (
        <div className="sectionContainer">
            <SectionTop heading="New Rent Detail" />

            <section className="sectionStyles">
                <div className={styles.listingItem}>
                    <NewPropertyTop data={data[0]} />

                    <div className={styles.gridContainer}>
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
                                    <span>Size: </span>
                                    <span>{data[0].size || "N/A"} sq.ft</span>
                                </li>
                                <li>
                                    <span>Bedrooms: </span>
                                    <span>
                                        {bedroomString(data[0].bedRooms)}
                                    </span>
                                </li>
                                <li>
                                    <span>Bathrooms: </span>
                                    <span>{data[0].bathrooms || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Total Floor: </span>
                                    <span>{data[0].totalFloor || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Floor: </span>
                                    <span>{data[0].floor || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Year Built: </span>
                                    <span>{data[0].buildYear || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Occupancy: </span>
                                    <span>{data[0].occupancy || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Parking: </span>
                                    <span>{data[0].parking || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Furniture: </span>
                                    <span>{data[0].isFurnished || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Deposit: </span>
                                    <span>
                                        {`AED ${formatNum(data[0].deposit)}` ||
                                            "N/A"}
                                    </span>
                                </li>
                                <li>
                                    <span>Cheques: </span>
                                    <span>{data[0].cheques || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Permit Number: </span>
                                    <span>{data[0].permitNumber || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Listed By: </span>
                                    <span>
                                        {data[0]?.created_by_agent?.name ||
                                            "N/A"}
                                    </span>
                                </li>
                                <li>
                                    <span>Ref Id : </span>
                                    <span>{data[0]?.propertyId || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Created At : </span>
                                    <span>
                                        {data[0]?.createTime
                                            ? dateToYMD(data[0]?.createTime)
                                            : "N/A"}
                                    </span>
                                </li>
                                <li>
                                    <span>Updated At : </span>
                                    <span>
                                        {data[0]?.lastUpdate
                                            ? dateToYMD(data[0]?.lastUpdate)
                                            : "N/A"}
                                    </span>
                                </li>
                                {data[0]?.dewa_no && (
                                    <li>
                                        <span>Dewa Number : </span>
                                        <span>{data[0]?.dewa_no || "N/A"}</span>
                                    </li>
                                )}

                                {data[0]?.building_info?.id && (
                                    <li>
                                        <span>Building id : </span>
                                        <span>
                                            {data[0]?.building_info?.id ||
                                                "N/A"}
                                        </span>
                                    </li>
                                )}
                                {data[0]?.building_info?.id && (
                                    <li>
                                        <span> Building Name: </span>
                                        <span>
                                            {data[0]?.building_info
                                                ?.building_name || "N/A"}
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </div>

                        <FollowUps
                            type="property"
                            targetId={data[0].id}
                            maxWidth={"100%"}
                        />
                    </div>

                    <div className={styles.gridContainer}>
                        <div className={`sectionDiv ${styles.description}`}>
                            <h3>
                                <img src="/icons/grid.svg" alt="" />
                                <span>Portal Agents</span>
                            </h3>

                            <div className={styles.gridContainer}>
                                <div>
                                    <h4>Bayut & Dubizzle</h4>
                                    <AgentContact
                                        onChangeAgent={(id, onClose) =>
                                            handleChangeAgent(
                                                "bayutDubizzle",
                                                id,
                                                onClose
                                            )
                                        }
                                        isChangingAgent={isPending}
                                        agentAvatar={
                                            bayutDubizzleAgentData?.avatar
                                        }
                                        agentName={bayutDubizzleAgentData?.name}
                                        agentPhone={
                                            bayutDubizzleAgentData?.phone
                                        }
                                        agentMail={
                                            bayutDubizzleAgentData?.email
                                        }
                                    />
                                </div>
                                <div>
                                    <h4>Property Finder</h4>
                                    <AgentContact
                                        onChangeAgent={(id, onClose) =>
                                            handleChangeAgent(
                                                "propertyFinder",
                                                id,
                                                onClose
                                            )
                                        }
                                        isChangingAgent={isPending}
                                        agentAvatar={
                                            propertyFinderAgentData?.avatar
                                        }
                                        agentName={
                                            propertyFinderAgentData?.name
                                        }
                                        agentPhone={
                                            propertyFinderAgentData?.phone
                                        }
                                        agentMail={
                                            propertyFinderAgentData?.email
                                        }
                                    />
                                </div>
                                <div>
                                    <h4>Own Portal</h4>
                                    <AgentContact
                                        onChangeAgent={(id, onClose) =>
                                            handleChangeAgent(
                                                "ownPortal",
                                                id,
                                                onClose
                                            )
                                        }
                                        isChangingAgent={isPending}
                                        agentAvatar={ownPortalAgentData?.avatar}
                                        agentName={ownPortalAgentData?.name}
                                        agentPhone={ownPortalAgentData?.phone}
                                        agentMail={ownPortalAgentData?.email}
                                    />
                                </div>
                                <div>
                                    <h4>Prop Fusion</h4>
                                    <AgentContact
                                        onChangeAgent={(id, onClose) =>
                                            handleChangeAgent(
                                                "propfusion",
                                                id,
                                                onClose
                                            )
                                        }
                                        isChangingAgent={isPending}
                                        agentAvatar={
                                            propfusionAgentData?.avatar
                                        }
                                        agentName={propfusionAgentData?.name}
                                        agentPhone={propfusionAgentData?.phone}
                                        agentMail={propfusionAgentData?.email}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`sectionDiv`}>
                            <PropertyLeades
                                propertyId={data[0]?.id}
                                type="RENT"
                                title="Property Leads"
                            />
                        </div>
                    </div>

                    <div className={styles.gridContainer}>
                        <div className={`sectionDiv ${styles.description}`}>
                            <div>
                                <WhatsappLeads
                                    propertyId={data[0]?.id}
                                    type="RENT"
                                    title="whatsapp leads"
                                />
                            </div>
                        </div>
                        <div>
                            <Logs
                                leadLogs={propertyLogsData}
                                isLoading={logsLoading}
                                isError={logsError}
                                title="Property Logs"
                            />
                        </div>
                    </div>

                    <div className={styles.gridContainer}>
                        <div className={`sectionDiv ${styles.description}`}>
                            <h3>
                                <img src="/icons/document.svg" alt="" />
                                <span>Description</span>
                            </h3>
                            <p>{data[0].description}</p>
                        </div>
                        <div></div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default NewRentProperty;
