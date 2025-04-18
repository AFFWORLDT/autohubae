import Leads from "../../features/leads/Leads";
import LeadsFilter from "../../features/leads/LeadsFilter";
import useInfiniteLeads from "../../features/leads/useInfiniteLeads";
import ExtraFilters from "../../ui/ExtraFilters";
import SectionTop from "../../ui/SectionTop";
import LeadsBaseTable from "./LeadsBaseTable";
import { useSearchParams } from "react-router-dom";
import { useDefaultSetting } from "../../store/defaultSettingStore";
import TabBar from "../../ui/TabBar";
import { LEAD_TABS_TYPE_OPTIONS } from "../../utils/constants";
import ToggleButton from "../../ui/ToggleButton";
import { Search } from "lucide-react";
import AddButtonToNavigateForms from "../../ui/AddButtonToNavigateForms";
import ViewToggleButton from "../../ui/ViewToggleButton";
import { useRef, useCallback, useEffect } from "react";
import ScrollToTop from "../../ui/ScrollToTop";
import LeadBasedOnStage from "./LeadBasedonStage";

function LeadsBase({ leadType }) {
    const {
        isLoading,
        leads,
        error,
        totalSize,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteLeads(leadType);
    const [searchParams, setSearchParams] = useSearchParams();
    const { leadView, setLeadView } = useDefaultSetting();
    const viewType = searchParams.get("viewType") || leadView;
    const containerRef = useRef(null);

    // Ensure viewType is set in URL params when page loads
    useEffect(() => {
        if (!searchParams.has("viewType") && leadView) {
            searchParams.set("viewType", leadView);
            setSearchParams(searchParams);
        } else if (searchParams.get("viewType") !== viewType) {
            // Update the store if URL has a different view type
            setLeadView(viewType);
        }
    }, [searchParams, setSearchParams, leadView, viewType, setLeadView]);

    const currentTab = LEAD_TABS_TYPE_OPTIONS.find(
        (tab) => tab.id === leadType
    );
    const bgColor = currentTab?.bgColor || "#ffffff";

    const handleLoadMore = useCallback(() => {
        if (!isFetchingNextPage && hasNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const handleViewChange = (newViewType) => {
        searchParams.set("viewType", newViewType);
        setSearchParams(searchParams);
        setLeadView(newViewType);
    };

    return (
        <div className="sectionContainer">
            <SectionTop heading={`${leadType[0] + leadType.toLowerCase().slice(1)} Leads`}>
                <TabBar
                    tabs={[
                        { id: "SELL", label: "Sell Leads", bgColor: "#f5f5f5" },
                        { id: "RENT", label: "Rent Leads", bgColor: "#f5f5f5" },
                        { id: "UNDEFINED", label: "Undefined Leads", bgColor: "#f5f5f5" }
                    ]}
                    activeTab={leadType}
                    navigateTo={(tabId) => `/leads/${tabId.toLowerCase()}`}
                />
            </SectionTop>

            <section
                ref={containerRef}
                className="sectionStyles"
                style={{
                    paddingTop: "4rem",
                    paddingLeft: "3rem",
                    backgroundColor: bgColor,
                    height: "calc(100vh)",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    
                }}
            >
                <style>
                    {`.sectionStyles::-webkit-scrollbar { display: none; }`}
                </style>
                <div>
                    <ToggleButton>
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "1rem",
                            marginBottom: "1rem",
                            paddingTop: "4rem",
                        }}>
                            <ExtraFilters
                                buttonOptions={[
                                    { label: "Active Leads", value: "ACTIVE" },
                                    { label: "Deal Leads", value: "DEAL" },
                                    // { label: "Leads Pool", value: "INACTIVE" },
                                    { label: "Inactive Leads", value: "INACTIVE" },
                                    { label: "Draft Leads", value: "DRAFT" },
                                ]}
                                totalSize={totalSize}
                                leadType={leadType}
                            />
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                flexWrap: "wrap",
                            }}>
                                <ToggleButton.Button
                                    label="Advanced Filter"
                                    icon={<Search />}
                                    style={{
                                        "--toggleBtn-primary": "#000",
                                        border: "1px solid #000",
                                        backgroundColor: "transparent",
                                        padding: "0.5rem 1rem",
                                        borderRadius: "0.5rem",
                                        color: "#000",
                                    }}
                                />
                                <AddButtonToNavigateForms />
                                <ViewToggleButton 
                                    defaultView={viewType} 
                                    viewParamName="viewType" 
                                    onViewChange={handleViewChange}
                                />
                                <button
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "0.8rem 1.4rem",
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "0.5rem",
                                        background: "white",
                                        cursor: "pointer",
                                        fontSize: "1.4rem",
                                        transition: "all 0.2s ease",
                                        fontWeight: "500",
                                    }}
                                    onClick={() => {
                                        const newViewType = viewType === "pipeline" ? "card" : "pipeline";
                                        handleViewChange(newViewType);
                                    }}
                                >
                                    <img
                                        src={`/icons/${viewType === "pipeline" ? "grid" : "eye"}.svg`}
                                        alt="Switch to pipeline view"
                                        style={{ width: "1.5rem", height: "1.5rem", marginRight: "0.5rem" }}
                                    />
                                    {viewType === "pipeline" ? "Card" : "Pipeline"}
                                </button>
                            </div>
                        </div>
                        <ToggleButton.Content>
                            <div className="LEADSfilter" style={{ padding: "1.5rem", borderTop: "1px solid #eee", backgroundColor: "transparent !important" }}>
                                <LeadsFilter />
                            </div>
                        </ToggleButton.Content>
                    </ToggleButton>

                    {viewType === "list" ? (
                        <LeadsBaseTable
                            leadType={leadType}
                            data={leads}
                            error={error}
                            totalSize={totalSize}
                            isLoading={isLoading}
                            containerRef={containerRef}
                            hasNextPage={hasNextPage}
                            fetchNextPage={fetchNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    ) : viewType === "card" ? (
                        <Leads
                            leadType={leadType}
                            isLoading={isLoading}
                            error={error}
                            data={leads}
                            totalSize={totalSize}
                            containerRef={containerRef}
                            hasNextPage={hasNextPage}
                            fetchNextPage={fetchNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    ) : (
                        <LeadBasedOnStage
                            data={leads}
                            isLoading={isLoading}
                            totalSize={totalSize}
                            containerRef={containerRef}
                            onLoadMore={handleLoadMore}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    )}
                </div>
            </section>
            <ScrollToTop containerRef={containerRef} />
        </div>
    );
}

export default LeadsBase;
