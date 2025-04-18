import { useNavigate, useSearchParams } from "react-router-dom";
import LeadItemTag from "../../features/leads/LeadItemTag";
import Spinner from "../../ui/Spinner";
import toast from "react-hot-toast";
import { useEffect, useCallback, useRef } from "react";
import LeadsItemStage from "../../features/leads/LeadsItemStage";
import LeadsItemGroups from "../../features/leads/LeadsItemGroups";
import AddLeadFollowup from "./AddLeadFollowup";
import useStaff from "../../features/admin/staff/useStaff";
import Modal from "../../ui/Modal";
import AgentChangeModal from "../../ui/AgentChangeModal";
import useUpdateLead from "../../features/leads/useUpdateLead";

// eslint-disable-next-line react-refresh/only-export-components
export const tableStyles = {
    container: {
        width: '100%',
        overflowX: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '1.3rem',
        paddingBottom: '0px',
        borderRadius: '12px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
        border: '1px solid #cbd5e1',
        borderBottom: 'none'
    },
    table: {
        width: '100%',
        minWidth: '170rem',
        borderCollapse: 'separate',
        borderSpacing: 0,
    },
    thead: {
        backgroundColor: 'transparent',
        position: 'sticky',
        top: 0,
        zIndex: 0
    },
    th: {
        padding: '16px 20px',
        textAlign: 'left',
        fontWeight: '600',
        color: '#04080e',
        borderBottom: '2px solid #cbd5e1',
        whiteSpace: 'nowrap',
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        cursor: 'pointer',
        userSelect: 'none'
    },
    tr: {
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    td: {
        padding: '16px 20px',
        borderBottom: '2px solid #cbd5e1',
        color: '#020f20',
        fontSize: '14px',
        lineHeight: '1.5'
    },
    agentButton: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        borderRadius: '8px',
        background: 'transparent',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: 'transparent',
            borderColor: '#94a3b8'
        }
    },
    detailsButton: {
        padding: '8px 16px',
        backgroundColor: 'transparent',
        color: '#475569',
        border: '2px solid #cbd5e1',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: 'transparent',
            borderColor: '#94a3b8'
        }
    }
};

// Add this debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export default function LeadsBaseTable({ 
    data, 
    error, 
    isLoading,
    containerRef,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage 
}) {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    // eslint-disable-next-line no-unused-vars
    const { data: staffData, isLoading: isLoadingStaff } = useStaff();
    const { changeLead, isPending: isUpdatingLead } = useUpdateLead();

    const debouncedFetch = useRef(
        debounce(() => fetchNextPage(), 300)
    ).current;

    const handleScroll = useCallback(() => {
        try {
            if (!containerRef?.current) return;

            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

            if (scrollPercentage > 70 && hasNextPage && !isFetchingNextPage) {
                debouncedFetch();
            }
        } catch (error) {
            console.error("Error in scroll handler:", error);
        }
    }, [containerRef, hasNextPage, isFetchingNextPage, debouncedFetch]);

    useEffect(() => {
        const currentRef = containerRef?.current;
        if (!currentRef) return;

        currentRef.addEventListener("scroll", handleScroll);
        return () => currentRef.removeEventListener("scroll", handleScroll);
    }, [containerRef, handleScroll]);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    if (isLoading) return <Spinner type="fullPage" />;

    const handleRowClick = (leadId) => {
        navigate(`/leads/details/${leadId}`);
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

    const handleSort = () => {
        const currentSort = searchParams.get('dateSortType') || 'DESC';
        const newSort = currentSort === 'DESC' ? 'ASC' : 'DESC';
        searchParams.set('dateSortType', newSort);
        setSearchParams(searchParams);
    };

    const currentSort = searchParams.get('dateSortType') || 'DESC';
    const sortIcon = currentSort === 'DESC' ? '↓' : '↑';

    return (
        <>
            <div style={tableStyles.container}>
                <table style={tableStyles.table}>
                    <thead style={tableStyles.thead}>
                        <tr>
                            <th 
                                style={{ ...tableStyles.th, width: '90px' }}
                                onClick={handleSort}
                            >
                                Created {sortIcon}
                            </th>
                            <th style={{ ...tableStyles.th, width: '100px' }}>Name</th>
                            <th style={{ ...tableStyles.th, width: '100px' }}>Phone</th>
                                <th style={{ ...tableStyles.th, width: '90px' }}>Agent</th>
                            <th style={{ ...tableStyles.th, width: '90px' }}>Follow Up</th>
                            <th style={{ ...tableStyles.th, width: '80px' }}>Details</th>
                            <th style={{ ...tableStyles.th, width: '120px' }}>Location</th>
                            {/* <th style={{ ...tableStyles.th, width: '100px' }}>Nationality</th> */}
                            {/* <th style={{ ...tableStyles.th, width: '90px' }}>Source</th> */}
                            <th style={{ ...tableStyles.th, width: '110px' }}>Property Type</th>
                            <th style={{ ...tableStyles.th, width: '110px' }}>Preferred Property </th>
                            <th style={{ ...tableStyles.th, width: '100px' }}>Tags</th>
                            <th style={{ ...tableStyles.th, width: '100px' }}>Stages</th>
                            <th style={{ ...tableStyles.th, width: '100px' }}>Groups</th>
                        
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item) => (
                            <tr
                                key={item.id}
                                style={{
                                    ...tableStyles.tr,
                                    backgroundColor: 'transparent',
                                    '&:hover': {
                                        backgroundColor: 'transparent'
                                    }
                                }}
                            >
                                <td style={tableStyles.td}>{new Date(item?.createTime).toLocaleString()}</td>
                                <td style={tableStyles.td}>{item?.name}</td>
                                <td style={tableStyles.td}>{item?.phone}</td>
                                <td style={tableStyles.td}>
                                    <Modal>
                                        <Modal.Open openWindowName="chooseAgent">
                                            <button
                                                disabled={isUpdatingLead}
                                                style={tableStyles.agentButton}
                                            >
                                                {item?.agent?.avatar ? (
                                                    <img 
                                                        src={item?.agent?.avatar} 
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '50%',
                                                            objectFit: 'cover',
                                                            marginRight: '8px'
                                                        }} 
                                                    />
                                                ) : (
                                                    <span style={{ marginRight: '8px' }}>{item?.agent?.title}</span>
                                                )}
                                                <img 
                                                    src="/icons/chevron-down.svg" 
                                                    style={{ 
                                                        width: '16px', 
                                                        height: '16px',
                                                        opacity: 0.5 
                                                    }} 
                                                />
                                            </button>
                                        </Modal.Open>
                                        <Modal.Window name="chooseAgent">
                                            <AgentChangeModal
                                                staffData={staffData}
                                                onChangeAgent={(agentId, onCloseModal) =>
                                                    handleChangeAgent(agentId, item.id, onCloseModal)
                                                }
                                                isChangingAgent={isUpdatingLead}
                                            />
                                        </Modal.Window>
                                    </Modal>
                                </td>
                                <td style={tableStyles.td}><AddLeadFollowup type="lead" targetId={item?.id} comment={item?.comment} /></td>
                                <td style={tableStyles.td}>
                                    <button 
                                        style={tableStyles.detailsButton}
                                        onClick={() => handleRowClick(item?.id)}
                                    >
                                        Details
                                    </button>
                                </td>
                                <td style={tableStyles.td}>
                                    {item?.areas?.length !== 0
                                        ? item?.areas?.map?.((obj) => (
                                            <span key={obj?.id}>
                                                {obj?.name}
                                                <br />
                                            </span>
                                        ))
                                        : "-"}
                                </td>
                                {/* <td style={tableStyles.td}>{item?.nationality || "-"}</td> */}
                                {/* <td style={tableStyles.td}>{<LeadIcon portal={item?.clientSource} /> || "-"}</td> */}
                                <td style={tableStyles.td}>
                                    {item?.property_type?.length !== 0
                                        ? item?.property_type?.join?.(", ")
                                        : "-"}
                                </td>
                                <td style={tableStyles.td}>
                                    {item?.preferred_property_details?.length !== 0
                                        ? (item?.preferred_property_details?.map((data)=>(
                                             <span key={data?.id}>{data?.title },</span>
                                        )))
                                        : "-"}
                                </td>
                                <td style={tableStyles.td}><LeadItemTag leadData={item} /></td>
                                <td style={tableStyles.td}><LeadsItemStage leadData={item} /></td>
                                <td style={tableStyles.td}><LeadsItemGroups leadData={item} /></td>
                               
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isFetchingNextPage && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    padding: '2rem',
                    backgroundColor: 'transparent',
                    position: 'sticky',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10
                }}>
                    <Spinner />
                </div>
            )}
        </>
    );
}