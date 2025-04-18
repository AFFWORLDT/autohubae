/* eslint-disable */

import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
    Calendar,
    Phone,
    Mail,
    DollarSign,
    Building,
    User,
} from "lucide-react";
import styles from "./LeadBasedonStage.module.css";
import useStages from "../../features/stages/useStages";
import Spinner from "../../ui/Spinner";
import { FollowUpForm } from "../../features/leads/AddFollowUpFrom";
import { useNavigate } from "react-router-dom";
import useCreateFollowUp from "../../features/followUps/useCreateFollowUp";
import Modal from "../../ui/Modal";
import AgentChangeModal from "../../ui/AgentChangeModal";
import useStaff from "../../features/admin/staff/useStaff";
import useUpdateLead from "../../features/leads/useUpdateLead";
import { tableStyles } from "./LeadsBaseTable";

// Move StageColumn component outside
const StageColumn = ({
    stage,
    leads,
    moveLead,
    isUnknownStage,
    setShowFollowUp,
}) => {
    const navigate = useNavigate();
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ["LEAD", "STAGE"],
        drop: (item) => {
            if (isUnknownStage) return;

            if (item.type === "STAGE") {
                item.leads.forEach((lead) => {
                    moveLead(lead, stage._id, true);
                });
            } else {
                moveLead(item.lead, stage._id);
            }
        },
        collect: (monitor) => ({
            isOver: !isUnknownStage && !!monitor.isOver(),
        }),
    }));

    const handleRowClick = (leadId) => {
        navigate(`/leads/details/${leadId}`);
    };

    return (
        <div
            ref={(node) => {
                drop(node);
            }}
            className={`${styles.stageColumn} ${isOver ? styles.dragOver : ""} ${isUnknownStage ? styles.unknownStage : ""}`}
            style={{ borderTop: `3px solid ${stage.color_code}` }}
            data-stage-id={stage._id}
        >
            <div className={styles.stageHeader}>
                <h3
                    className={styles.stageTitle}
                    style={{ color: stage.color_code }}
                >
                    {stage.name}
                </h3>
                <span className={styles.leadCount}>{leads.length}</span>
            </div>
            <div className={styles.leadList}>
                {leads.map((lead) => (
                    <DraggableLeadCard
                        key={lead.id}
                        lead={lead}
                        stageColor={stage.color_code}
                        handleRowClick={() => handleRowClick(lead.id)}
                        setShowFollowUp={setShowFollowUp}
                    />
                ))}
            </div>
        </div>
    );
};

// Main component
const LeadBasedOnStage = ({
    data,
    isLoading,
    containerRef,
    onLoadMore,
    isFetchingNextPage,
}) => {
    const { data: stages } = useStages("leads");
    const [leadsData, setLeadsData] = useState({});
    const [showFollowUp, setShowFollowUp] = useState(null);
    const [isDraggingOverGap, setIsDraggingOverGap] = useState(false);
    const { addFollowUp } = useCreateFollowUp();

    // Improved scroll handler
    const handleScroll = React.useCallback(() => {
        if (!containerRef?.current || isFetchingNextPage) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const scrolledToBottom = scrollHeight - scrollTop <= clientHeight * 1.2; // Load when 20% from bottom

        if (scrolledToBottom) {
            onLoadMore?.();
        }
    }, [onLoadMore, containerRef, isFetchingNextPage]);

    useEffect(() => {
        const container = containerRef?.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);
        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll, containerRef]);

    const groupLeadsByStage = React.useMemo(() => {
        if (!stages || !data) return {};

        const groupedLeads = stages.reduce((acc, stage) => {
            acc[stage._id] = data.filter(
                (lead) => lead.latest_followup?.stages === stage._id.toString()
            );
            return acc;
        }, {});

        // Add Unknown stage for leads without a stage or with invalid stage
        groupedLeads["unknown"] = data.filter(
            (lead) =>
                !lead.latest_followup?.stages ||
                !stages.some(
                    (stage) =>
                        stage._id.toString() === lead.latest_followup?.stages
                )
        );

        return groupedLeads;
    }, [stages, data]);

    useEffect(() => {
        if (JSON.stringify(groupLeadsByStage) !== JSON.stringify(leadsData)) {
            setLeadsData(groupLeadsByStage);
        }
    }, [groupLeadsByStage]);

    const moveLead = (lead, toStageId, isMultiple = false) => {
        if (toStageId === "unknown") return;

        const payload = {
            type: "lead",
            target_id: lead.id,
            comment: lead.comment,
            stages: toStageId,
            text: "Change",
        };
        if (toStageId !== "unknown") {
            addFollowUp(payload);
        }

        setLeadsData((prevLeads) => {
            const updatedLeads = { ...prevLeads };
            const currentStageId = Object.keys(updatedLeads).find((stageId) =>
                updatedLeads[stageId]?.some((l) => l.id === lead.id)
            );

            if (currentStageId) {
                if (isMultiple) {
                    const leadsToMove = updatedLeads[currentStageId];
                    updatedLeads[currentStageId] = [];

                    const updatedLeadsArray = leadsToMove.map((l) => ({
                        ...l,
                        latest_followup: {
                            ...l.latest_followup,
                            stages: toStageId.toString(),
                        },
                    }));

                    updatedLeads[toStageId] = [
                        ...(updatedLeads[toStageId] || []),
                        ...updatedLeadsArray,
                    ];
                } else {
                    updatedLeads[currentStageId] = updatedLeads[
                        currentStageId
                    ].filter((l) => l.id !== lead.id);
                    const updatedLead = {
                        ...lead,
                        latest_followup: {
                            ...lead.latest_followup,
                            stages: toStageId.toString(),
                        },
                    };
                    updatedLeads[toStageId] = [
                        ...(updatedLeads[toStageId] || []),
                        updatedLead,
                    ];
                }
            }

            return updatedLeads;
        });
    };

    const [, drop] = useDrop(() => ({
        accept: ["LEAD", "STAGE"],
        hover: (item, monitor) => {
            if (!monitor.isOver()) return;
            setIsDraggingOverGap(true);
        },
        drop: (item, monitor) => {
            const dropPos = monitor.getClientOffset();
            if (!dropPos) return;

            const stageColumns = document.querySelectorAll(
                `.${styles.stageColumn}`
            );
            let nearestStage = null;
            let minDistance = Infinity;

            stageColumns.forEach((column) => {
                const stageId = column.getAttribute("data-stage-id");
                if (stageId === "unknown") return;

                const rect = column.getBoundingClientRect();
                const columnCenter = rect.left + rect.width / 2;
                const distance = Math.abs(columnCenter - dropPos.x);

                if (distance < minDistance) {
                    minDistance = distance;
                    nearestStage = stageId;
                }
            });

            if (nearestStage) {
                moveLead(item.lead, nearestStage, item.isMultiple);
            }

            setIsDraggingOverGap(false);
        },
    }));

    if (isLoading) return <Spinner type="fullPage" />;

    return (
        <div className={styles.container} ref={drop}>
            {/* Loading indicator at top */}
            {isFetchingNextPage && (
                <div className={styles.topLoader}>
                    <Spinner />
                </div>
            )}

            <div className={styles.boardContainer}>
                {/* First show Unknown stage */}
                <StageColumn
                    key="unknown"
                    stage={{
                        _id: "unknown",
                        name: "New Leads",
                        color_code: "#808080",
                    }}
                    leads={leadsData["unknown"] || []}
                    moveLead={moveLead}
                    isUnknownStage={true}
                    setShowFollowUp={setShowFollowUp}
                />

                {stages
                    ?.sort((a, b) => a.position - b.position)
                    .map((stage) => (
                        <StageColumn
                            key={stage._id}
                            stage={stage}
                            leads={leadsData[stage._id] || []}
                            moveLead={moveLead}
                            isUnknownStage={false}
                            setShowFollowUp={setShowFollowUp}
                        />
                    ))}
                {isDraggingOverGap && <div className={styles.dropIndicator} />}
            </div>

            {/* Bottom loading indicator */}
            {isFetchingNextPage && (
                <div className={styles.bottomLoader}>
                    <Spinner />
                </div>
            )}

            {showFollowUp && (
                <div className={styles.followUpOverlay}>
                    <div className={styles.followUpModal}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setShowFollowUp(null)}
                        >
                            ×
                        </button>
                        <FollowUpForm
                            type="lead"
                            targetId={showFollowUp.leadId}
                            comment={showFollowUp.comment}
                            stage={showFollowUp.stageid}
                            onCloseModal={() => setShowFollowUp(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

// DraggableLeadCard component (also move outside)

const DraggableLeadCard = ({
    lead,
    stageColor,
    handleRowClick,
    setShowFollowUp,
}) => {
    const { data: staffData, isLoading: isLoadingStaff } = useStaff();
    const { changeLead, isPending: isUpdatingLead } = useUpdateLead();
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "LEAD",
        item: {
            type: "LEAD",
            lead,
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const formatBudget = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "AED",
            maximumFractionDigits: 0,
        }).format(value);
    };

    function handleChangeAgent(agentId, leadId, onCloseModal) {
        changeLead(
            {
                id: leadId,
                payload: { agent_Id: agentId },
            },
            {
                onSettled: () => {
                    onCloseModal();
                },
            }
        );
    }
    const handleFollowUpClick = (e) => {
        e.stopPropagation(); // Prevent card click event
        setShowFollowUp({
            leadId: lead.id,
            comment: lead.comment,
            stageid: lead.latest_followup?.stages,
        });
    };

    return (
        <div
            ref={drag}
            className={`${styles.leadCard} ${isDragging ? styles.dragging : ""}`}
            style={{ "--stage-color": stageColor }}
        >
            <>
                <div className={styles.cardHeader}>
                    <div className={styles.avatarSection}>
                        <div
                            className={styles.headerInfo}
                            onClick={() => handleRowClick(lead?.id)}
                        >
                            <div className={styles.leadName}>{lead?.name}</div>
                           

                            <button
                                className={styles.followUpButton}
                                onClick={handleFollowUpClick}
                            >
                                Follow
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.cardBody}>
                    <div>
                        <div className={styles.infoRow}>
                            <DollarSign size={14} />
                            <span className={styles.budget}>
                                {formatBudget(lead?.budgetFrom || 0)} -{" "}
                                {formatBudget(lead?.budgetTo || 0)}
                            </span>
                        </div>

                        <div className={styles.infoRow}>
                            <Phone size={14} />
                            <span className={styles.phone}>{lead?.phone}</span>
                        </div>

                        {lead?.email && (
                            <div className={styles.infoRow}>
                                <Mail size={14} />
                                <span className={styles.email}>
                                    {lead?.email}
                                </span>
                            </div>
                        )}

                        {lead?.company && (
                            <div className={styles.infoRow}>
                                <Building size={14} />
                                <span className={styles.company}>
                                    {lead?.company}
                                </span>
                            </div>
                        )}
                    </div>

                    <div>
                        <Modal>
                            <Modal.Open openWindowName="chooseAgent">
                                <button
                                    disabled={isUpdatingLead}
                                    style={tableStyles.agentButton}
                                >
                                    {lead?.agent?.avatar ? (
                                        <img
                                            src={lead?.agent?.avatar}
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                marginRight: "8px",
                                            }}
                                        />
                                    ) : (
                                        <span style={{ marginRight: "8px" }}>
                                            {lead?.agent?.title}
                                        </span>
                                    )}
                                    <img
                                        src="/icons/chevron-down.svg"
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            opacity: 0.5,
                                        }}
                                    />
                                </button>
                            </Modal.Open>
                            <Modal.Window name="chooseAgent">
                                <AgentChangeModal
                                    staffData={staffData}
                                    onChangeAgent={(agentId, onCloseModal) =>
                                        handleChangeAgent(
                                            agentId,
                                            lead.id,
                                            onCloseModal
                                        )
                                    }
                                    isChangingAgent={isUpdatingLead}
                                />
                            </Modal.Window>
                        </Modal>
                    </div>
                </div>
            </>

            {lead.latest_followup?.date && (
                <div className={styles.cardFooter}>
                    <Calendar size={14} />
                    <span className={styles.followupDate}>
                        Last Contact:{" "}
                        {new Date(
                            lead.latest_followup.date
                        ).toLocaleDateString()}
                    </span>
                </div>
            )}
        </div>
    );
};

export default LeadBasedOnStage;
