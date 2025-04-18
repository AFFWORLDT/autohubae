import SectionTop from "../ui/SectionTop";
import AreaGrid from "../features/areas/AreaGrid";
import ChangeAreaAgents from "../features/areas/ChangeAreaAgents";
import { useAuth } from "../context/AuthContext";
import AreaFilter from "../features/areas/AreaFilter";
import AddAgentIdInParams from "../ui/AddAgentIdInParams";
import { AREA_DEVELOPER_TABS } from "../utils/constants";
import TabBar from "../ui/TabBar";
import ToggleButton from "../ui/ToggleButton";
import { Search, LayoutGrid, LayoutList, LayoutTemplate } from "lucide-react";
import { useRef } from "react";
import ScrollToTop from "../ui/ScrollToTop";
import { useSearchParams } from "react-router-dom";
import ViewToggleButton from "../ui/ViewToggleButton";
import AreaInteractive from "../features/areas/AreaInteractive";
import AreaTable from "../features/areas/AreaTable";

function AreasList() {
    const [searchParams] = useSearchParams();
    const currentTab = AREA_DEVELOPER_TABS.find(
        (tab) => tab.id === "AREA"
    );
    const bgColor = currentTab?.bgColor || "#ffffff";
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === "admin" || currentUser?.role === "super_admin";
    const containerRef = useRef(null);
    const viewType = searchParams.get("viewType") ?? "interactive";

    const viewOptions = [
        { value: "grid", label: "Grid View", icon: <LayoutGrid size={20} /> },
        { value: "table", label: "Table View", icon: <LayoutList size={20} /> },
        { value: "interactive", label: "Interactive View", icon: <LayoutTemplate size={20} /> }
    ];

    return (
        <div className="sectionContainer">
            <SectionTop heading="Areas List">
                <TabBar
                    tabs={AREA_DEVELOPER_TABS}
                    activeTab={"AREA"}
                    navigateTo={(tabId) => {
                        if (tabId === "AREA") {
                            return "/areas/list";
                        }
                        return `/developers/list`;
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
                <div>
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
                            <div></div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    flexWrap: "wrap",
                                }}
                            >
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
                                <AddAgentIdInParams buttonName="My Areas" />
                                {isAdmin && <ChangeAreaAgents />}
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
                                    backgroundColor: "transparent !important",
                                }}
                            >
                                <AreaFilter />
                            </div>
                        </ToggleButton.Content>
                    </ToggleButton>

                    {viewType === "grid" && <AreaGrid containerRef={containerRef} />}
                    {viewType === "table" && <AreaTable containerRef={containerRef} />}
                    {viewType === "interactive" && <AreaInteractive containerRef={containerRef} />}
                </div>
            </section>
            <ScrollToTop containerRef={containerRef} />
        </div>
    );
}

export default AreasList;
