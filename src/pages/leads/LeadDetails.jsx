/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import styles from "../../styles/Leads.module.css";
import useLead from "../../features/leads/useLead";
import toast from "react-hot-toast";
import SectionTop from "../../ui/SectionTop";
import Spinner from "../../ui/Spinner";
import { formatNum, getDaysFromCurrentDate } from "../../utils/utils";
import DeleteLead from "../../features/leads/DeleteLead";
import PageNotFound from "../PageNotFound";
import useUpdateLead from "../../features/leads/useUpdateLead";
import { useNavigate } from "react-router-dom";
import FollowUps from "../../features/followUps/FollowUps";
import Modal from "../../ui/Modal";
import AgentChangeModal from "../../ui/AgentChangeModal";
import useStaff from "../../features/admin/staff/useStaff";
import Breadcrumb from "../../ui/Breadcrumb";
import useStages from "../../features/stages/useStages";
import useFollowUps from "../../features/followUps/useFollowUps";
import Notes from "../../features/notes/Notes";
import useLeadLogs from "../../features/leads/useLeadLogs";
import Logs from "./Logs";
import PreferredProperty from "../../features/leads/PrefredPropert";
import LeadMessage from "../../features/leads/LeadMessage";

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" });
}

function LeadDetails() {
    const { data: leadData, isLoading: isLoadingLead, error } = useLead();
    const { changeLead, isPending: isUpdatingLead } = useUpdateLead();
    const { data: staffData, isLoading: isLoadingStaff } = useStaff();
    const {
        data: leadLogs,
        isPending: leadLogsPending,
        error: leadLogsError,
    } = useLeadLogs();
    const {
        data: stageData,
        isLoading: isLoadingStages,
        error: errorStages,
    } = useStages("leads");
    const {
        isLoading,
        data,
        error: errorFollowUps,
    } = useFollowUps("lead", leadData[0]?.id);

    const navigate = useNavigate();

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    function handleClaim() {
        changeLead({
            id: leadData[0]?.id,
            payload: { ...leadData[0], isClaim: "YES" },
        });
    }

    function handleStatusChange(status) {
        changeLead({
            id: leadData[0]?.id,
            payload: { ...leadData[0], status },
        });
    }

    function handleChangeAgent(agentId, onCloseModal) {
        changeLead(
            {
                id: leadData[0]?.id,
                payload: { ...leadData[0], agent_Id: agentId },
            },
            {
                onSettled: onCloseModal,
            }
        );
    }

    if (isLoadingLead) return <Spinner type="fullPage" />;
    if (leadData?.length === 0) return <PageNotFound />;

    const modifiedStages = stageData?.map((stage) => ({
        label: stage?.name,
        value: stage?._id,
    }));

    const stage = leadData[0]?.latest_followup?.stages;

    return (
        <div className="sectionContainer">
            <SectionTop heading="Lead Details" />

            <section className={`${styles.leadDetails} sectionStyles`}>
                {(data?.[0]?.stage_data?.name ||
                    data?.[0]?.rating_data?.name) && (
                    <div className="sectionDiv">
                        <div>
                            <span
                                style={{
                                    fontWeight: 600,
                                    color: data?.[0]?.stage_data?.color_code,
                                    borderColor:
                                        data?.[0]?.stage_data?.color_code,
                                    border: "1px solid",
                                    padding: "5px 10px",
                                    borderRadius: "8px",
                                }}
                            >
                                {data?.[0]?.stage_data?.name}
                            </span>
                            <span
                                style={{
                                    marginLeft: "10px",
                                    fontWeight: 600,
                                    color: data?.[0]?.rating_data?.color_code,
                                    borderColor:
                                        data?.[0]?.rating_data?.color_code,
                                    border: "1px solid",
                                    padding: "5px 10px",
                                    borderRadius: "8px",
                                }}
                            >
                                {data?.[0]?.rating_data?.name}
                            </span>
                        </div>
                    </div>
                )}
                <div className="sectionDiv">
                    <Breadcrumb
                        loading={isLoadingStages}
                        items={modifiedStages}
                        filter={(item) => item.value !== Number(stage)}
                    />
                </div>
                <div className="sectionDiv">
                    <div className={styles.leadItem} key={leadData[0]?.id}>
                        <div className={styles.leadContent}>
                            <div className={styles.leadTop}>
                                <h2>{leadData[0]?.name}</h2>
                                <span>
                                    {`${getDaysFromCurrentDate(leadData[0]?.createTime)} days ago`}
                                </span>
                            </div>
                            <ul>
                                <li>
                                    <span>Lead ID</span>
                                    <span>{leadData[0]?.id || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Budget</span>
                                    <span>{`${leadData[0]?.budgetFrom ? formatNum(leadData[0]?.budgetFrom) : "N/A"}-${leadData[0]?.budgetTo ? formatNum(leadData[0]?.budgetTo) + " AED" : "N/A"}`}</span>
                                </li>
                                <li>
                                    <span>Wp Lead ID</span>
                                    <span>{`${leadData[0]?.whatsapp_lead_id ? leadData[0]?.whatsapp_lead_id: "N/A"}  `}</span>
                                </li>
                                <li>
                                    <span>Location</span>
                                    <span>
                                        {leadData[0]?.areas?.length !== 0
                                            ? leadData[0]?.areas?.map?.(
                                                  (obj) => (
                                                      <span key={obj?.id}>
                                                          {obj?.name}
                                                          <br />
                                                      </span>
                                                  )
                                              )
                                            : "N/A"}
                                    </span>
                                </li>
                                <li>
                                    <span>Phone</span>
                                    <span>{leadData[0]?.phone || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Secondary Phone</span>
                                    <span>
                                        {leadData[0]?.secondryPhone || "N/A"}
                                    </span>
                                </li>
                                <li>
                                    <span>Email</span>
                                    <span>{leadData[0]?.email || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Nationality</span>
                                    <span>
                                        {leadData[0]?.nationality || "N/A"}
                                    </span>
                                </li>
                                <li>
                                    <span>Source</span>
                                    <span>
                                        {leadData[0]?.clientSource || "N/A"}
                                    </span>
                                </li>
                                <li>
                                    <span>Property Type</span>
                                    <span>
                                        {leadData[0]?.property_type?.length !==
                                        0
                                            ? leadData[0]?.property_type?.join?.(
                                                  ", "
                                              )
                                            : "N/A"}
                                    </span>
                                </li>
                                {leadData[0]?.clientType === "SELL" && (
                                    <li>
                                        <span>Preferred Project</span>
                                        <span>
                                            {leadData[0]?.projectType || "N/A"}
                                        </span>
                                    </li>
                                )}
                                <li>
                                    <span>status</span>
                                    <span>{`${leadData[0]?.status ? leadData[0]?.status : "N/A"}`}</span>
                                </li>
                                <li>
                                    <span>Preferred Rooms</span>
                                    <span>{`${leadData[0]?.roomsFrom ? leadData[0]?.roomsFrom : "N/A"}-${leadData[0]?.roomsTo ? leadData[0]?.roomsTo : "N/A"}`}</span>
                                </li>
                                <li>
                                    <span>Bath Rooms</span>
                                    <span>{`${leadData[0]?.from_bathroom ? leadData[0]?.from_bathroom : "N/A"}-${leadData[0]?.to_bathroom ? leadData[0]?.roomsTo : "N/A"}`}</span>
                                </li>
                                <li>
                                    <span>Price</span>
                                    <span>{`${leadData[0]?.from_price ? leadData[0]?.from_price : "N/A"}-${leadData[0]?.to_price ? leadData[0]?.to_price : "N/A"}`}</span>
                                </li>
                                <li>
                                    <span>Budget</span>
                                    <span>{`${leadData[0]?.budgetFrom ? leadData[0]?.budgetFrom : "N/A"}-${leadData[0]?.budgetTo ? leadData[0]?.budgetTo : "N/A"}`}</span>
                                </li>
                                <li>
                                    <span>Claim</span>
                                    <span>{`${leadData[0]?.isClaim ? leadData[0]?.isClaim : "N/A"}`}</span>
                                </li>

                                {leadData[0]?.locations?.length > 0 && (
                                    <>
                                        <li>
                                            <span>id</span>
                                            <span>{`${leadData[0]?.locations ? leadData[0]?.locations[0]?.id : "N/A"}`}</span>
                                        </li>
                                        <li>
                                            <span>City</span>
                                            <span>{`${leadData[0]?.locations ? leadData[0]?.locations[0]?.city : "N/A"}`}</span>
                                        </li>
                                        <li>
                                            <span>Tower</span>
                                            <span>
                                                {leadData[0]?.locations?.[0]
                                                    ?.tower || "N/A"}
                                            </span>
                                        </li>
                                        <li>
                                            <span>Community</span>
                                            <span>
                                                {leadData[0]?.locations?.[0]
                                                    ?.community || "N/A"}
                                            </span>
                                        </li>
                                        <li>
                                            <span>Sub Community</span>
                                            <span>
                                                {leadData[0]?.locations?.[0]
                                                    ?.sub_community || "N/A"}
                                            </span>
                                        </li>
                                    </>
                                )}

                                <li>
                                    <span>Agent</span>
                                    <span>
                                        {leadData[0]?.agent?.name || "N/A"}
                                    </span>
                                    <Modal>
                                        <Modal.Open openWindowName="chooseAgent">
                                            <button
                                                className={
                                                    styles.btnChooseAgent
                                                }
                                                disabled={isLoadingStaff}
                                            >
                                                <img src="/icons/chevron-down.svg" />
                                            </button>
                                        </Modal.Open>
                                        <Modal.Window name="chooseAgent">
                                            <AgentChangeModal
                                                staffData={staffData}
                                                onChangeAgent={
                                                    handleChangeAgent
                                                }
                                                isChangingAgent={isUpdatingLead}
                                            />
                                        </Modal.Window>
                                    </Modal>
                                </li>
                                {leadData[0]?.leads_message && (
                                    <li className={styles.messageWrapper}>
                                        <span>Message</span>
                                        <span className={styles.messageContent}>
                                            <span
                                                className={styles.messageTitle}
                                            >
                                                {leadData[0].leads_message
                                                    .split(" ")
                                                    .slice(0, 3)
                                                    .join(" ")}
                                                ...
                                            </span>
                                            <div
                                                className={
                                                    styles.messagePopover
                                                }
                                            >
                                                {leadData[0].leads_message}
                                            </div>
                                        </span>
                                    </li>
                                )}

                                {leadData[0]?.bayut_lead_id && (
                                    <li>
                                        <span>Bayut Lead ID</span>
                                        <span>{leadData[0].bayut_lead_id}</span>
                                    </li>
                                )}

                                {leadData[0]?.createTime && (
                                    <li>
                                        <span>Created At</span>
                                        <span>{formatDate(leadData[0].createTime)}</span>
                                    </li>
                                )}

                                {leadData[0]?.updateTime && (
                                    <li>
                                        <span>Update At</span>
                                        <span>{formatDate(leadData[0].updateTime)}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className={styles.btnsLeadOperations}>
                        {leadData[0]?.isClaim === "NO" && (
                            <button
                                onClick={handleClaim}
                                disabled={isUpdatingLead}
                            >
                                Claim Lead
                            </button>
                        )}

                        {leadData[0]?.status === "ACTIVE" && (
                            <button
                                onClick={() => handleStatusChange("INACTIVE")}
                                disabled={isUpdatingLead}
                            >
                                Inactivate
                            </button>
                        )}

                        {leadData[0]?.status === "INACTIVE" && (
                            <button
                                onClick={() => handleStatusChange("ACTIVE")}
                                disabled={isUpdatingLead}
                            >
                                Activate
                            </button>
                        )}

                        <button
                            onClick={() =>
                                navigate(`/leads/edit/${leadData[0]?.id}`)
                            }
                        >
                            Edit
                        </button>

                        <DeleteLead
                            data={leadData[0]}
                            className={styles.btnDeleteLead}
                        />
                    </div>
                </div>

                <div className={styles.gridContainer}>
                    <div className={styles.followUps}>
                        <FollowUps
                            type="lead"
                            targetId={leadData[0]?.id}
                            maxWidth="100%"
                            isForProperty={false}
                        />
                    </div>
                    <div className={styles.leadLogs}>
                        <Logs
                            leadLogs={leadLogs}
                            isLoading={isLoadingLead}
                            isError={leadLogsError}
                        />
                    </div>
                    <div className={styles.followUps}>
                        <PreferredProperty
                            preferred_property_details={
                                leadData[0]?.preferred_property_details
                            }
                            type={leadData[0]?.clientType}
                        />
                    </div>
                    <div className={styles.followUps}>
                        {leadData[0]?.leads_message && (
                            <LeadMessage
                                message={leadData[0]?.leads_message}
                                agentName={leadData[0]?.agent?.name}
                                phoneNumber={leadData[0]?.phone}
                            />
                        )}
                    </div>
                    <div className={styles.notes}>
                        <Notes
                            type="lead"
                            targetId={leadData[0]?.id}
                            maxWidth="100%"
                            data={leadData[0]}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LeadDetails;
