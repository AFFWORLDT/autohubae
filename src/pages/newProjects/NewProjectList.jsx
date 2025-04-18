import { useSearchParams } from "react-router-dom";
import { Search, LayoutGrid, LayoutList, LayoutTemplate } from "lucide-react";
import NewProjects from "../../features/newProjects/NewProjects";
import NewProjectsFilter from "../../features/newProjects/NewProjectsFilter";
import NewProjectsInTable from "../../features/newProjects/NewProjectsInTable";
import NewProjectsInteractive from "../../features/newProjects/NewProjectsInteractive";
import useInfiniteProjects from "../../features/newProjects/useInfiniteProjects";
import ExtraFilters from "../../ui/ExtraFilters";
import SectionTop from "../../ui/SectionTop";
import ToggleButton from "../../ui/ToggleButton";
import AddButtonToNavigateForms from "../../ui/AddButtonToNavigateForms";
import ViewToggleButton from "../../ui/ViewToggleButton";
import TabBar from "../../ui/TabBar";
import { LISTINGS_TABS_TYPE_OPTIONS_LIGHT } from "../../utils/constants";
import { useCallback, useRef, useEffect } from "react";
import ScrollToTop from "../../ui/ScrollToTop";
import Filter from "../../ui/Filter";
import useStaff from "../../features/admin/staff/useStaff";

function NewProjectList() {
    const {
        projects,
        isLoading,
        error,
        totalSize,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteProjects();
    const [searchParams] = useSearchParams();
    const viewType = searchParams.get("viewType") ?? "interactive";
    const containerRef = useRef(null);

    // Add debounce timeout ref
    const timeoutRef = useRef(null);

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new debounced timeout
        timeoutRef.current = setTimeout(() => {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

            if (
                scrollHeight - (scrollTop + clientHeight) < scrollHeight * 0.2 &&
                hasNextPage &&
                !isFetchingNextPage
            ) {
                fetchNextPage();
            }
        }, 200); // 200ms debounce delay
    }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
            // Clear timeout on cleanup
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [handleScroll]);

    // Find the matching tab to get the background color
    const currentTab = LISTINGS_TABS_TYPE_OPTIONS_LIGHT.find(
        (tab) => tab.id === "PROJECTS"
    );
    const bgColor = currentTab?.bgColor || "#ffffff"; // Default to white if no match
    const { data: agentData, isLoading: isAgentLoading } = useStaff()

    const agentOptions = agentData.map((item) => {
        return { value: item.id, label: item.name };
    });

    const viewOptions = [
        { value: "card", label: "Card View", icon: <LayoutGrid size={20} /> },
        { value: "table", label: "Table View", icon: <LayoutList size={20} /> },
        { value: "interactive", label: "Interactive View", icon: <LayoutTemplate size={20} /> }
    ];

    return (
        <div className="sectionContainer">
            <SectionTop heading={`New Project List`}>
                <TabBar
                    tabs={LISTINGS_TABS_TYPE_OPTIONS_LIGHT}
                    activeTab={"PROJECTS"}
                    navigateTo={(tabId) => {
                        if (tabId === "PROJECTS") {
                            return "/new-projects/list";
                        }
                        return `/for-${tabId.toLowerCase()}/new-list`;
                    }}
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
                    {`
                        .sectionStyles::-webkit-scrollbar {
                            display: none;
                        }
                    `}
                </style>
                <div className="">
                    <ToggleButton>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "1rem",
                                marginBottom: "1rem",
                                paddingTop: "4rem",
                            }}
                        >
                            <ExtraFilters
                                buttonOptions={[
                                    { label: "Active", value: "ACTIVE" },
                                    { label: "Sold Out", value: "SOLD" },
                                    { label: "Pool", value: "POOL" },
                                ]}
                                totalSize={totalSize}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    justifyContent: "flex-end",
                                    flexWrap: "wrap",
                                }}
                            >
                                <Filter showReset={false}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                                        <Filter.Input registerName="project_name" placeholder="Name" />
                                        <Filter.InputDataList
                                            registerName="agent_id"
                                            placeholder="Agent"
                                            data={agentOptions}
                                            isLoading={isAgentLoading}
                                        />
                                    </div>
                                </Filter>
                                <ToggleButton.Button
                                    label="Advanced Filter"
                                    icon={<Search />}
                                    style={{
                                        border: "1px solid #000",
                                        backgroundColor: "transparent",
                                        color: "#000",
                                        padding: "0.5rem 1rem",
                                        borderRadius: "0.5rem",
                                    }}
                                />
                                <AddButtonToNavigateForms />
                                <ViewToggleButton
                                    defaultView="interactive"
                                    viewParamName="viewType"
                                    viewOptions={viewOptions}
                                />
                            </div>
                        </div>
                        <ToggleButton.Content>
                            <div
                                className="LEADSfilter"
                                style={{
                                    padding: "1.5rem",
                                    borderTop: "1px solid #eee",
                                    backgroundColor: "transparent",
                                }}
                            >
                                <NewProjectsFilter />
                            </div>
                        </ToggleButton.Content>
                    </ToggleButton>

                    {viewType === "card" ? (
                        <NewProjects
                            isLoading={isLoading}
                            data={projects}
                            totalSize={totalSize}
                            error={error}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    ) : viewType === "table" ? (
                        <NewProjectsInTable
                            isLoading={isLoading}
                            data={projects}
                            totalSize={totalSize}
                            error={error}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    ) : (
                        <NewProjectsInteractive
                            isLoading={isLoading}
                            data={projects}
                            totalSize={totalSize}
                            error={error}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    )}
                </div>
            </section>
            <ScrollToTop containerRef={containerRef} />
        </div>
    );
}

export default NewProjectList;
