import { useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import styles from "../../styles/Leads.module.css";
import { useNavigate } from "react-router-dom";
import { formatNum, getDaysFromCurrentDate } from "../../utils/utils";
import LeadItemTag from "./LeadItemTag";
import useInfiniteLeads from "./useInfiniteLeads";

function Leads({ leadType, containerRef }) {
    const navigate = useNavigate();
    const { 
        isLoading, 
        leads, 
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage 
    } = useInfiniteLeads(leadType);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    const handleScroll = useCallback(() => {
        if (!containerRef?.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

        if (scrollPercentage > 80 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, fetchNextPage, isFetchingNextPage, containerRef]);

    useEffect(() => {
        const container = containerRef?.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);
        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll, containerRef]);

    if (isLoading) return <Spinner type="fullPage" />;

    return (
        <div style={{ position: 'relative' }}>
            <div className={styles.leads}>
                {leads.map((item) => (
                    <div className={styles.leadItem} key={item.id}>
                        <div className={styles.leadContent}>
                            <div className={styles.leadTop}>
                                <h2>{item.name}</h2>
                                <LeadItemTag leadData={item} />
                                <span>
                                    {`${getDaysFromCurrentDate(item.createTime)} days ago`}
                                </span>
                            </div>
                            <ul
                                onClick={() =>
                                    navigate(`/leads/details/${item.id}`)
                                }
                            >
                                <li>
                                    <span>Budget</span>
                                    <span>{`${item.budgetFrom ? formatNum(item.budgetFrom) : "N/A"}-${item.budgetTo ? formatNum(item.budgetTo) + " AED" : "N/A"}`}</span>
                                </li>
                                <li>
                                    <span>Location</span>
                                    <span>
                                        {item.areas?.length !== 0
                                            ? item.areas?.map?.((obj) => (
                                                <span key={obj.id}>
                                                    {obj.name}
                                                    <br />
                                                </span>
                                            ))
                                            : "N/A"}
                                    </span>
                                </li>
                                <li>
                                    <span>Nationality</span>
                                    <span>{item.nationality || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Source</span>
                                    <span>
                                        {item.clientSource || "N/A"}
                                    </span>
                                </li>
                                <li>
                                    <span>Property Type</span>
                                    <span>
                                        {item.property_type?.length !== 0
                                            ? item.property_type?.join?.(
                                                ", "
                                            )
                                            : "N/A"}
                                    </span>
                                </li>
                                {leadType === "SELL" && (
                                    <li>
                                        <span>Preferred Project</span>
                                        <span>
                                            {item.projectType || "N/A"}
                                        </span>
                                    </li>
                                )}
                                <li>
                                    <span>Preferred Rooms</span>
                                    <span>{`${item.roomsFrom ? item.roomsFrom : "N/A"}-${item.roomsTo ? item.roomsTo : "N/A"}`}</span>
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
                    padding: '2rem',
                    backgroundColor: 'transparent' 
                }}>
                    <Spinner />
                </div>
            )}
        </div>
    );
}

export default Leads;
