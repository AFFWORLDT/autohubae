import SectionTop from "../../ui/SectionTop";
import ExtraFilters from "../../ui/ExtraFilters";
import NewPropertiesFilter from "../../features/properties/NewPropertiesFilter";
import NewProperties from "../../features/properties/NewProperties";
import Tags from "../../features/tags/Tags";
import MultiSelectAction from "../../ui/MultiSelectAction";
import { useSelectedProperties } from "../../context/SelectedPropertiesContext";
import NewPropertyInTable from "../../features/properties/NewPropertyInTable";
import { useSearchParams } from "react-router-dom";
import { useDefaultSetting } from "../../store/defaultSettingStore";
import ToggleButton from "../../ui/ToggleButton";
import { Search, LayoutGrid, LayoutList, LayoutTemplate } from "lucide-react";
import AddButtonToNavigateForms from "../../ui/AddButtonToNavigateForms";
import ViewToggleButton from "../../ui/ViewToggleButton";
import TabBar from "../../ui/TabBar";
import { LISTINGS_TABS_TYPE_OPTIONS_LIGHT } from "../../utils/constants";
import useInfiniteProperties from "../../features/properties/useInfiniteProperties";
import { useCallback, useRef, useEffect } from "react";
import ScrollToTop from "../../ui/ScrollToTop";
import Filter from "../../ui/Filter";
import useStaff from "../../features/admin/staff/useStaff";
import SellPropertyInteractive from "../../features/properties/SellPropertyInteractive";
import RentPropertyInteractive from "../../features/properties/RentPropertyInteractive";

function NewPropertiesList({ listingType }) {
    // const { isLoading, data, totalSize, error } = useNewProperties(listingType);
    const {
        properties,
        isLoading,
        error,
        totalSize,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteProperties(listingType);
    const [searchParams] = useSearchParams();
    const { view } = useDefaultSetting();
    const viewType = searchParams.get("viewType") ?? view;
    const { showCheckboxes, handleMultiSelect } = useSelectedProperties();
    const containerRef = useRef(null);

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const scrollPercentage =
            (scrollTop / (scrollHeight - clientHeight)) * 100;

        if (scrollPercentage > 80 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [handleScroll]);

    const currentTab = LISTINGS_TABS_TYPE_OPTIONS_LIGHT.find(
        (tab) => tab.id === listingType
    );
    const bgColor = currentTab?.bgColor || "#ffffff"; // Default to white if no match
    const { data: agentData, isLoading: isAgentLoading } = useStaff();
    const agentOptions = agentData.map((item) => {
        return { value: item.id, label: item.name };
    });

    return (
        <div className="sectionContainer">
            <SectionTop
                heading={`${listingType[0] + listingType.toLowerCase().slice(1)} List`}
            >
                <TabBar
                    tabs={LISTINGS_TABS_TYPE_OPTIONS_LIGHT}
                    activeTab={listingType}
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
                                    { label: "Inactive", value: "INACTIVE" },
                                    {
                                        label: `${listingType === "RENT" ? "Rented" : "Sold"}`,
                                        value: `${listingType === "RENT" ? "RENTED" : "SOLD"}`,
                                    },
                                    {
                                        label: "Draft",
                                        value: `DRAFT`,
                                    },
                                ]}
                                totalSize={totalSize}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    flexWrap: "wrap",
                                }}
                            >
                                <Filter showReset={false} smallHandleResetBtn={true}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "1rem",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <Filter.Input
                                            registerName="title"
                                            placeholder="Name"
                                        />
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
                                    defaultView="card"
                                    viewParamName="viewType"
                                    viewOptions={[
                                        { value: "card", label: "Card View", icon: <LayoutGrid size={20} /> },
                                        { value: "table", label: "Table View", icon: <LayoutList size={20} /> },
                                        { value: "interactive", label: "Interactive View", icon: <LayoutTemplate size={20} /> }
                                    ]}
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
                                <NewPropertiesFilter />
                            </div>
                        </ToggleButton.Content>
                    </ToggleButton>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Tags tagType="properties" />
                        <MultiSelectAction
                            onClick={handleMultiSelect}
                            showCheckboxes={showCheckboxes}
                        />
                    </div>

                    {viewType === "interactive" && listingType === "SELL" ? (
                        <SellPropertyInteractive
                            isLoading={isLoading}
                            error={error}
                            data={properties}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    ) : viewType === "interactive" && listingType === "RENT" ? (
                        <RentPropertyInteractive
                            isLoading={isLoading}
                            error={error}
                            data={properties}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    ) : viewType === "card" ? (
                        <NewProperties
                            listingType={listingType}
                            isLoading={isLoading}
                            error={error}
                            data={properties}
                            totalSize={totalSize}
                            showCheckboxes={showCheckboxes}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    ) : (
                        <NewPropertyInTable
                            listingType={listingType}
                            isLoading={isLoading}
                            error={error}
                            data={properties}
                            totalSize={totalSize}
                            showCheckboxes={showCheckboxes}
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

export default NewPropertiesList;
